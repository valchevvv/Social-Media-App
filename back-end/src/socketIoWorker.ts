// SocketIoWorker.ts
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

interface ConnectedUser {
    userId: string;
    socketId: string;
}

export class SocketIoWorker {
    private io: Server;
    private connectedUsers: ConnectedUser[] = [];

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: '*', // Adjust according to your needs
                methods: ['GET', 'POST'],
            },
        });
        this.setupConnection();
    }

    private setupConnection(): void {
        this.io.on('connection', (socket: Socket) => {
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

            // Handle custom events here
            socket.on('notification', (data) => {
                console.log('notification received:', data);
                const recipientSocketId = this.getSocketIdByUserId(data.recipientUserId);
                if (recipientSocketId) {
                    this.io.to(recipientSocketId).emit('notification', data);
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

    private getSocketIdByUserId(userId: string): string | undefined {
        console.log('connectedUsers:', this.connectedUsers);
        const user = this.connectedUsers.find(user => user.userId === userId);
        return user?.socketId;
    }

    public emit(event: string, data: any): void {
        this.io.emit(event, data);
    }
}
