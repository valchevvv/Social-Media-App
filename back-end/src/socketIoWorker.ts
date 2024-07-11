// socketIoWorker.ts

import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { UserService } from './services/userService'; // Adjust path if needed

const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret key

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
            console.log('a user connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('user disconnected:', socket.id);
                this.removeUser(socket.id);
            });

            socket.on('login', (data: { userId: string; token: string }) => {
                console.log('user logged in:', data.userId);
                // Verify JWT token
                jwt.verify(data.token, JWT_SECRET, (err, decoded) => {
                    if (err) {
                        console.log('Authentication failed for user:', data.userId);
                        socket.emit('unauthorized', 'Invalid token'); // Emit unauthorized event to frontend if token is invalid
                        return;
                    }
                    // Proceed with authorization if token is valid
                    const authorized = this.authorizeUser(socket, data.userId);
                    if (authorized) {
                        socket.emit('authorized'); // Emit authorization event to frontend
                    }
                });
            });

            // Handle follow event
            socket.on('follow', async (data: { userId: string; followId: string }) => {
                try {
                    const userId = new ObjectId(data.userId);
                    const followId = new ObjectId(data.followId);
                    const result = await UserService.followUser(userId, followId);
                    if (result) {
                        console.log(`User ${userId} followed user ${followId}`);
                        socket.emit('followed', { followerId: userId.toString(), followStatus: 'followed' });
                        socket.emit('followed', { followerId: followId.toString(), followStatus: 'followed' });
                    }
                } catch (error) {
                    console.error('Error following user:', error);
                }
            });

            // Add more event handlers as needed
        });
    }

    private authorizeUser(socket: Socket, userId: string): boolean {
        // Simulate authorization logic; replace with your actual authorization process
        // For example, check if userId is valid and authorized
        const isAuthorized = true; // Replace with your authorization logic
        if (isAuthorized) {
            this.addUser(userId, socket.id);
        }
        return isAuthorized;
    }

    private addUser(userId: string, socketId: string): void {
        // Check if user already exists
        const existingUser = this.connectedUsers.find(user => user.userId === userId);
        if (existingUser) {
            // Update socketId if user re-connects
            existingUser.socketId = socketId;
        } else {
            // Add new user
            this.connectedUsers.push({ userId, socketId });
        }
    }

    private removeUser(socketId: string): void {
        this.connectedUsers = this.connectedUsers.filter(user => user.socketId !== socketId);
    }

    public getConnectedUsers(): ConnectedUser[] {
        return this.connectedUsers;
    }

    public getSocketIdByUserId(userId: string): string | undefined {
        const user = this.connectedUsers.find(user => user.userId === userId);
        return user?.socketId;
    }

    public emitToUser(io: Server, userId: string, event: string, data: any): void {
        const socketId = this.getSocketIdByUserId(userId);
        if (socketId) {
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