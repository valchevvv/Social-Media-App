// SocketIoHelper.ts
import { io, Socket } from 'socket.io-client';

export class SocketIoHelper {
    private socket: Socket;

    constructor(serverUrl: string, userId: string) {
        this.socket = io(serverUrl, {
            query: {
                userId,
            },
        });
        this.setupListeners();
    }

    private setupListeners(): void {
        this.socket.on('connect', () => {
            console.log('connected to server');
        });

        this.socket.on('disconnect', () => {
            console.log('disconnected from server');
        });

        // Handle custom events here
        this.socket.on('notification', (data) => {
            console.log('notification received:', data);
        });

        // Add more event listeners as needed
    }

    public emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }

    public on(event: string, callback: (data: any) => void): void {
        this.socket.on(event, callback);
    }

    public off(event: string, callback?: (data: any) => void): void {
        this.socket.off(event, callback);
    }
}
