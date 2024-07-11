// socketIoWorker.ts

import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

interface ConnectedUser {
    userId: string;
    socketId: string;
}

export class SocketIoWorker {
    private static instance: SocketIoWorker;

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

            // Handle login event with user._id
            socket.on('login', (userId: string) => {
                console.log('user logged in:', userId);
                const authorized = this.authorizeUser(socket, userId);
                if (authorized) {
                    socket.emit('authorized'); // Emit authorization event to frontend
                }
            });

            // Add more event handlers as needed
        });
    }

    private connectedUsers: ConnectedUser[] = [];

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
        console.log('connectedUsers:', this.connectedUsers);
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
