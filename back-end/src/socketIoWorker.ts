// socketIoWorker.ts

import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { IUser, User } from './models/User'; // Adjust path as per your project structure
import { UserService } from './services/userService'; // Adjust path as per your project structure
import { PostService } from './services/postService';
import { CommentService } from './services/commentService';

const JWT_SECRET = 'daniel2k24'; // Replace with your actual secret key

interface ConnectedUser {
    userId: string;
    socketId: string;
}

const debug = false

export class SocketIoWorker {
    private static instance: SocketIoWorker;
    private connectedUsers: ConnectedUser[] = [];

    private constructor() {}

    public static getInstance(): SocketIoWorker {
        if (!SocketIoWorker.instance) {
            SocketIoWorker.instance = new SocketIoWorker();
        }
        return SocketIoWorker.instance;
    }

    public setupConnection(server: HttpServer, io: Server): void {
        io.on('connection', (socket: Socket) => {
            const { userid, token } = socket.request.headers;

            if(debug) console.log('User attempting to connect:', userid);

            if(!userid || !token) {
                if(debug) console.log('User not authenticated');
                socket.emit('unauthorized', 'Authentication required'); // Emit unauthorized event to frontend if user is not authenticated
                return;
            }

            if(debug) console.log('User authenticated:', userid);
            // Add user to connected users
            const authorized = this.authorizeUser(socket, userid as string);
            if(authorized) socket.emit('authorized'); // Emit authorization event to frontend
            else socket.emit('unauthorized', 'Authentication failed'); // Emit unauthorized event to frontend if user is not authorized

            socket.on('disconnect', () => {
                if(debug) console.log('User disconnected:', socket.id);
                this.removeUser(socket.id);
            });

            // Handle follow event
            socket.on('follow_b', async (data: { userId: string; followId: string }) => {
                if(debug) console.log('User attempting to follow/unfollow:', data.userId, '->', data.followId);
                try {
                    const userId = new ObjectId(data.userId);
                    const followId = new ObjectId(data.followId);
                    const result : {
                        follow: boolean,
                        followed: boolean,
                        sender: {
                            id: string,
                            username: string
                        },
                        receiver: {
                            id: string,
                            username: string
                        }
                    } = await UserService.followUser(userId, followId);
                    const action = result.follow ? 'followed' : 'unfollowed';
                    if(debug) console.log(`User ${data.userId} ${action} user ${data.followId}`);
                    this.emitToUser(io, followId.toString(), 'followed_f', { sender: userId.toString(), receiver: followId.toString(), followStatus: action, notifyDetails: {
                        follow: result.follow,
                        followed: result.followed,
                        sender: {
                            id: result.sender.id,
                            username: result.sender.username,
                        },
                        receiver: {
                            id: result.receiver.id,
                            username: result.receiver.username,
                        }
                    } });
                    this.emitToUser(io, userId.toString(), 'followed_f', { sender: userId.toString(), receiver: followId.toString(), followStatus: action, notifyDetails: {
                        follow: result.follow,
                        followed: result.followed,
                        sender: {
                            id: result.sender.id,
                            username: result.sender.username,
                        },
                        receiver: {
                            id: result.receiver.id,
                            username: result.receiver.username,
                        }
                    }});
                } catch (error) {
                    if(debug) console.error('Error following/unfollowing user:', error);
                }
            });
            socket.on('like_b', async (data: { userId: string; postId: string }) => {
                
                if(debug) console.log('User attempting to like/unlike post:', data.userId, '->', data.postId);
                try {
                    const result = await PostService.likePost(new ObjectId(data.postId), new ObjectId(data.userId));
                    const action = result.likeStatus ? 'liked' : 'unliked';
                    if(debug) console.log(`User ${data.userId} ${action} post ${data.postId}`);
                    const username = await UserService.getSimpleUserById(data.userId);
                    this.emitToUser(io, data.userId, 'like_f', { sender: {
                        id: data.userId,
                        username: username
                    }, post: data.postId, likeStatus: action });
                    if(action === "liked") this.emitToUser(io, result.author.toString(), 'liked_f', { sender: {
                        id: data.userId,
                        username: username
                    } });
                } catch (error) {
                    if(debug) console.error('Error liking/unliking post:', error);
                }
            });

            socket.on('comment_b', async (data: { userId: string, postId: string, content: string }) => {
                if(debug) console.log('User attempting to comment on post:', data.userId, '->', data.postId);
                try {
                    const result = await CommentService.createComment(new ObjectId(data.userId), new ObjectId(data.postId), data.content);
                    if(debug) console.log(`User ${data.userId} commented on post ${data.postId}`);
                    const comment = {
                        _id: result.comment._id,
                        post: result.comment.post,
                        author: {
                            id: result.comment.author.toString(),
                            username: result.postAuthor.username,
                            profilePicture: result.postAuthor.profilePicture
                        },
                        content: result.comment.content,
                        createdAt: result.comment.createdAt
                    }
                    this.emitToUser(io, data.userId, 'comment_f', comment);
                    this.emitToUser(io, result!.postAuthor!._id!.toString(), 'commented_f', { sender: {
                        id: data.userId,
                        username: result.postAuthor.username,
                        profilePicture: result.postAuthor.profilePicture
                    } });
                } catch (error) {
                    if(debug) console.error('Error commenting on post:', error);
                }
            });

            // Add more event handlers as needed
        });
    }

    private authorizeUser(socket: Socket, userId: string): boolean {
        if(debug) console.log('Authorizing user:', userId);
        // Simulate authorization logic; replace with your actual authorization process
        const isAuthorized = true; // Replace with your authorization logic
        if (isAuthorized) {
            this.addUser(userId, socket.id);
            if(debug) console.log('User authorized and added to connected users:', userId);
        } else {
            if(debug) console.log('User not authorized:', userId);
        }
        return isAuthorized;
    }

    private addUser(userId: string, socketId: string): void {
        if(debug) console.log('Adding user to connected users:', userId);
        // Check if user already exists
        const existingUser = this.connectedUsers.find(user => user.userId === userId);
        if (existingUser) {
            // Update socketId if user re-connects
            existingUser.socketId = socketId;
            if(debug) console.log('Updated socket ID for user:', userId);
        } else {
            // Add new user
            this.connectedUsers.push({ userId, socketId });
            if(debug) console.log('Added new user to connected users:', userId);
        }
    }

    private removeUser(socketId: string): void {
        if(debug) console.log('Removing user with socket ID:', socketId);
        this.connectedUsers = this.connectedUsers.filter(user => user.socketId !== socketId);
    }

    public getConnectedUsers(): ConnectedUser[] {
        return this.connectedUsers;
    }

    public getSocketIdByUserId(userId: string): string | undefined {
        const user = this.connectedUsers.find(user => user.userId === userId);
        return user?.socketId;
    }

    private emitToUser(io: Server, userId: string, event: string, data: any): void {
        const socketId = this.getSocketIdByUserId(userId);
        if (socketId) {
            if(debug) console.log(`Emitting event "${event}" to user ${userId} (socket ID: ${socketId}) with data:`, data);
            io.to(socketId).emit(event, data);
        } else {
            if(debug) console.log(`User with ID ${userId} is not connected`);
        }
    }
}

export const io = (server: HttpServer) => {
    const io = new Server(server);
    const socketIoWorker = SocketIoWorker.getInstance();
    socketIoWorker.setupConnection(server, io);
    return io;
}
