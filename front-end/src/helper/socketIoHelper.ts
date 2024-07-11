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
        this.emitLogin(userId); // Automatically emit login event upon construction
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

        // Handle authorization event from backend
        this.socket.on('authorized', () => {
            console.log('Authorization successful');
            // Handle any actions upon successful authorization, if needed
        });

        // Add more event listeners as needed
    }

    private emitLogin(userId: string): void {
        this.socket.emit('login', userId);
        console.log('Login emitted with userId:', userId);
    }

    public emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }

    public follow(userId: string, followId: string): void {
        this.socket.emit('follow', { userId, followId });
    }

    public unfollow(userId: string, followId: string): void {
        this.socket.emit('unfollow', { userId, followId });
    }

    public on(event: string, callback: (data: any) => void): void {
        this.socket.on(event, callback);
    }

    public off(event: string, callback?: (data: any) => void): void {
        this.socket.off(event, callback);
    }
}
