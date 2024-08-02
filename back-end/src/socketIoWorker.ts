import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { IUser, User } from './models/User'; // Adjust path as per your project structure
import { UserService } from './services/userService'; // Adjust path as per your project structure
import { PostService } from './services/postService';
import { CommentService } from './services/commentService';
import { ConversationService } from './services/conversationService';

const JWT_SECRET = process.env.JWT_SECRET; // Replace with your actual secret key

interface ConnectedUser {
    userId: string;
    socketId: string;
}

const debug = false;

export class SocketIoWorker {
    private static instance: SocketIoWorker;
    private connectedUsers: ConnectedUser[] = [];
    private io: Server;

    private constructor(io: Server) {
        this.io = io;
    }

    public static getInstance(io: Server): SocketIoWorker {
        if (!SocketIoWorker.instance) {
            SocketIoWorker.instance = new SocketIoWorker(io);
        }
        return SocketIoWorker.instance;
    }

    public setupConnection(server: HttpServer, io: Server): void {
        io.on('connection', (socket: Socket) => {
            const { userid, token } = socket.request.headers;

            if (debug) console.log('User attempting to connect:', userid);

            if (!userid || !token) {
                if (debug) console.log('User not authenticated');
                socket.emit('unauthorized', 'Authentication required');
                return;
            }

            if (debug) console.log('User authenticated:', userid);
            const authorized = this.authorizeUser(socket, userid as string);
            if (authorized) socket.emit('authorized');
            else socket.emit('unauthorized', 'Authentication failed');

            socket.on('disconnect', () => {
                if (debug) console.log('User disconnected:', socket.id);
                this.removeUser(socket.id);
            });

            this.onWithAuthorization(socket, 'follow_b', this.handleFollow);
            this.onWithAuthorization(socket, 'like_b', this.handleLike);
            this.onWithAuthorization(socket, 'comment_b', this.handleComment);
            this.onWithAuthorization(socket, 'unfollow_b', this.handleUnfollow);
            this.onWithAuthorization(socket, 'new_message_b', this.handleNewMessage);
            this.onWithAuthorization(socket, 'new_conversation_b', this.handleNewConversation);

        });
    }

    private authorizeUser(socket: Socket, userId: string): boolean {
        if (debug) console.log('Authorizing user:', userId);
        const isAuthorized = true; // Replace with your authorization logic
        if (isAuthorized) {
            this.addUser(userId, socket.id);
            if (debug) console.log('User authorized and added to connected users:', userId);
        } else {
            if (debug) console.log('User not authorized:', userId);
        }
        return isAuthorized;
    }

    private addUser(userId: string, socketId: string): void {
        if (debug) console.log('Adding user to connected users:', userId);
        const existingUser = this.connectedUsers.find(user => user.userId === userId);
        if (existingUser) {
            existingUser.socketId = socketId;
            if (debug) console.log('Updated socket ID for user:', userId);
        } else {
            this.connectedUsers.push({ userId, socketId });
            if (debug) console.log('Added new user to connected users:', userId);
        }
    }

    private removeUser(socketId: string): void {
        if (debug) console.log('Removing user with socket ID:', socketId);
        this.connectedUsers = this.connectedUsers.filter(user => user.socketId !== socketId);
    }

    public getConnectedUsers(): ConnectedUser[] {
        return this.connectedUsers;
    }

    public getSocketIdByUserId(userId: string): string | undefined {
        const user = this.connectedUsers.find(user => user.userId === userId);
        return user?.socketId;
    }

    private emitToUser(userId: string, event: string, data: any): void {
        const socketId = this.getSocketIdByUserId(userId);
        if (socketId) {
            if (debug) console.log(`Emitting event "${event}" to user ${userId} (socket ID: ${socketId}) with data:`, data);
            this.io.to(socketId).emit(event, data);
        } else {
            if (debug) console.log(`User with ID ${userId} is not connected`);
        }
    }

    private onWithAuthorization(socket: Socket, event: string, handler: Function) {
        socket.on(event, async (data: any) => {
            const { userid } = socket.request.headers;
            const authorized = this.authorizeUser(socket, userid as string);
            if (!authorized) {
                socket.emit('unauthorized', 'Authentication required');
                return;
            }
            try {
                await handler.call(this, socket, data);
            } catch (error) {
                if (debug) console.error(`Error handling event "${event}":`, error);
            }
        });
    }

    private async handleFollow(socket: Socket, data: { userId: string; followId: string }) {
        if (!data.userId || !data.followId) throw new Error('Invalid data');
        if (debug) console.log('User attempting to follow/unfollow:', data.userId, '->', data.followId);
        try {
            const userId = new ObjectId(data.userId);
            const followId = new ObjectId(data.followId);
            const result = await UserService.followUser(userId, followId);
            const action = result.follow ? 'followed' : 'unfollowed';
            if (debug) console.log(`User ${data.userId} ${action} user ${data.followId}`);
            this.emitToUser(followId.toString(), 'followed_f', {
                sender: userId.toString(),
                receiver: followId.toString(),
                followStatus: action,
                notifyDetails: {
                    follow: result.follow,
                    followed: result.followed,
                    sender: {
                        id: result.sender.id,
                        username: result.sender.username,
                    },
                    receiver: {
                        id: result.receiver.id,
                        username: result.receiver.username,
                    },
                },
            });
            this.emitToUser(userId.toString(), 'followed_f', {
                sender: userId.toString(),
                receiver: followId.toString(),
                followStatus: action,
                notifyDetails: {
                    follow: result.follow,
                    followed: result.followed,
                    sender: {
                        id: result.sender.id,
                        username: result.sender.username,
                    },
                    receiver: {
                        id: result.receiver.id,
                        username: result.receiver.username,
                    },
                },
            });
        } catch (error) {
            if (debug) console.error('Error following/unfollowing user:', error);
        }
    }

    private async handleLike(socket: Socket, data: { userId: string; postId: string }) {
        if (!data.userId || !data.postId) throw new Error('Invalid data');
        if (debug) console.log('User attempting to like/unlike post:', data.userId, '->', data.postId);
        try {
            const result = await PostService.likePost(new ObjectId(data.postId), new ObjectId(data.userId));
            const action = result.likeStatus ? 'liked' : 'unliked';
            if (debug) console.log(`User ${data.userId} ${action} post ${data.postId}`);
            const username = await UserService.getSimpleUserById(data.userId);
            this.emitToUser(data.userId, 'like_f', {
                sender: {
                    id: data.userId,
                    username: username,
                },
                post: data.postId,
                likeStatus: action,
            });
            if (action === 'liked')
                this.emitToUser(result.author.toString(), 'liked_f', {
                    sender: {
                        id: data.userId,
                        username: username,
                    },
                });
        } catch (error) {
            if (debug) console.error('Error liking/unliking post:', error);
        }
    }

    private async handleComment(socket: Socket, data: { userId: string; postId: string; content: string }) {
        if (!data.userId || !data.postId || !data.content) throw new Error('Invalid data');
        if (debug) console.log('User attempting to comment on post:', data.userId, '->', data.postId);
        try {
            const result = await CommentService.createComment(new ObjectId(data.userId), new ObjectId(data.postId), data.content);
            if (debug) console.log(`User ${data.userId} commented on post ${data.postId}`);
            const commentAuthor = await UserService.getUserById(result.comment.author._id.toString());
            const comment = {
                _id: result.comment._id,
                post: result.comment.post,
                author: {
                    id: commentAuthor?._id,
                    username: commentAuthor?.username,
                    profilePicture: commentAuthor?.profilePicture,
                },
                content: result.comment.content,
                createdAt: result.comment.createdAt,
            };
            this.emitToUser(data.userId, 'comment_f', comment);
            this.emitToUser(result!.postAuthor!._id!.toString(), 'commented_f', {
                sender: {
                    id: data.userId,
                    username: commentAuthor?.username,
                    profilePicture: commentAuthor?.profilePicture,
                },
            });
        } catch (error) {
            if (debug) console.error('Error commenting on post:', error);
        }
    }

    private async handleUnfollow(socket: Socket, data: { userId: string; followId: string; type: 'unfollow' | 'remove' }) {
        if (!data.userId || !data.followId) throw new Error('Invalid data');
        if (debug) console.log('User attempting to unfollow:', data.userId, '->', data.followId);
        try {
            const userId = new ObjectId(data.userId);
            const followId = new ObjectId(data.followId);
            const result = await UserService.unfollowUser(userId, followId, data.type);
            if (debug) console.log(`User ${data.userId} unfollowed user ${data.followId}`);
            this.emitToUser(userId.toString(), 'unfollow_f', {});
        } catch (error) {
            if (debug) console.error('Error unfollowing user:', error);
        }
    }

    private async handleNewMessage(socket: Socket, data: { userId: string; conversationId: string; content: string }) {
        if (!data.userId || !data.conversationId || !data.content) throw new Error('Invalid data');
        if (debug) console.log('User attempting to send message:', data.userId, '->', data.conversationId);
        try {
            const message = await ConversationService.createMessage(data.conversationId, data.userId, data.content);
            if (debug) console.log(`User ${data.userId} sent message in conversation ${data.conversationId}`);
            this.emitToUser(data.userId, 'new_message_f', message);
            const participants = await ConversationService.getParticipants(new ObjectId(data.conversationId));
            participants.forEach((participant) => {
                if (participant.toString() !== data.userId)
                    this.emitToUser(participant._id.toString(), 'new_message_f', message);
            });
        } catch (error) {
            if (debug) console.error('Error sending message:', error);
        }
    }

    private async handleNewConversation(socket: Socket, data: { userId: string; contactId: string }) {
        if (!data.userId || !data.contactId) throw new Error('Invalid data');
        if (debug) console.log('User attempting to start new conversation:', data.userId, '->', data.contactId);
        try {
            const conversation = await ConversationService.createConversation([new ObjectId(data.userId), new ObjectId(data.contactId)]);
            if (debug) console.log(`User ${data.userId} started new conversation with user ${data.contactId}`);
            this.emitToUser(data.userId, 'new_conversation_f', conversation);
            //this.emitToUser(io, data.contactId, 'new_conversation_f', conversation);
        } catch (error) {
            if (debug) console.error('Error starting new conversation:', error);
        }
    }
}

export const io = (server: HttpServer) => {
    const io = new Server(server);
    const socketIoWorker = SocketIoWorker.getInstance(io);
    socketIoWorker.setupConnection(server, io);
    return io;
};
