// socketIoWorker.ts

import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { UserService } from './services/userService'; // Adjust path as per your project structure

const JWT_SECRET = 'daniel2k24'; // Replace with your actual secret key

interface ConnectedUser {
    userId: string;
    socketId: string;
}

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
            console.log('A user connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                this.removeUser(socket.id);
            });

            socket.on('login', (data: { userId: string; token: string }) => {
                console.log('User attempting to log in:', data.userId);
                // Verify JWT token
                jwt.verify(data.token, JWT_SECRET, (err, decoded) => {
                    if (err) {
                        console.log('Authentication failed for user:', data.userId);
                        socket.emit('unauthorized', 'Invalid token'); // Emit unauthorized event to frontend if token is invalid
                        return;
                    }
                    console.log('Authentication succeeded for user:', data.userId);
                    // Proceed with authorization if token is valid
                    const authorized = this.authorizeUser(socket, data.userId);
                    if (authorized) {
                        console.log('Authorization succeeded for user:', data.userId);
                        socket.emit('authorized'); // Emit authorization event to frontend
                    } else {
                        console.log('Authorization failed for user:', data.userId);
                        socket.emit('unauthorized', 'Authorization failed'); // Emit unauthorized event to frontend if authorization fails
                    }
                });
            });

            // Handle follow event
            socket.on('follow_b', async (data: { userId: string; followId: string }) => {
                console.log('User attempting to follow/unfollow:', data.userId, '->', data.followId);
                try {
                    const userId = new ObjectId(data.userId);
                    const followId = new ObjectId(data.followId);
                    const result : {
                        follow: boolean,
                        followed: boolean
                    } = await UserService.followUser(userId, followId);
                    const action = result.follow ? 'followed' : 'unfollowed';
                    console.log(`User ${data.userId} ${action} user ${data.followId}`);
                    this.emitToUser(io, followId.toString(), 'followed_f', { sender: userId.toString(), reciever: followId.toString(), followStatus: action });
                    this.emitToUser(io, userId.toString(), 'followed_f', { sender: userId.toString(), reciever: followId.toString(), followStatus: action });
                } catch (error) {
                    console.error('Error following/unfollowing user:', error);
                }
            });

            // Add more event handlers as needed
        });
    }

    private authorizeUser(socket: Socket, userId: string): boolean {
        console.log('Authorizing user:', userId);
        // Simulate authorization logic; replace with your actual authorization process
        const isAuthorized = true; // Replace with your authorization logic
        if (isAuthorized) {
            this.addUser(userId, socket.id);
            console.log('User authorized and added to connected users:', userId);
        } else {
            console.log('User not authorized:', userId);
        }
        return isAuthorized;
    }

    private addUser(userId: string, socketId: string): void {
        console.log('Adding user to connected users:', userId);
        // Check if user already exists
        const existingUser = this.connectedUsers.find(user => user.userId === userId);
        if (existingUser) {
            // Update socketId if user re-connects
            existingUser.socketId = socketId;
            console.log('Updated socket ID for user:', userId);
        } else {
            // Add new user
            this.connectedUsers.push({ userId, socketId });
            console.log('Added new user to connected users:', userId);
        }
    }

    private removeUser(socketId: string): void {
        console.log('Removing user with socket ID:', socketId);
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
            console.log(`Emitting event "${event}" to user ${userId} (socket ID: ${socketId}) with data:`, data);
            io.to(socketId).emit(event, data);
        } else {
            console.log(`User with ID ${userId} is not connected`);
        }
    }
}

export const io = (server: HttpServer) => {
    const io = new Server(server);
    const socketIoWorker = SocketIoWorker.getInstance();
    socketIoWorker.setupConnection(server, io);
    return io;
}
