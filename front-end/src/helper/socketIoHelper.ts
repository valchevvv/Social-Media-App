// SocketIoHelper.ts

import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    _id: string;
    exp: number;
    iat: number;
}

export class SocketIoHelper {
    private socket: Socket;
    private userId: string | null;
    private token: string | null;

    constructor(serverUrl: string) {
        this.token = localStorage.getItem('userToken');

        if (!this.token) {
            throw new Error('Token not found. Please log in.');
        }

        // Decode token to get userId
        const decodedUser = jwtDecode<DecodedToken>(this.token);

        if (!decodedUser) {
            throw new Error('Invalid token. Please log in.');
        }
        this.userId = decodedUser._id;

        if (!this.userId) {
            throw new Error('User ID not found in token. Please log in.');
        }

        this.socket = io(serverUrl, {
            query: {
                userId: this.userId,
                token: this.token,
            },
        });

        this.setupListeners();
        this.emitLogin(this.userId, this.token); // Automatically emit login event upon construction
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

        this.socket.on('unauthorized', (message: string) => {
            console.log('Authorization failed:', message);
            // Handle unauthorized event, e.g., redirect to login page
        });

        // Add more event listeners as needed
    }

    private emitLogin(userId: string, token: string): void {
        this.socket.emit('login', { userId, token });
        console.log('Login emitted with userId and token:', userId, token);
    }

    public emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }

    public follow(followId: string): void {
        if (this.userId) {
            this.socket.emit('follow_b', { userId: this.userId, followId });
        }
    }

    public on(event: string, callback: (data: any) => void): void {
        this.socket.on(event, callback);
    }

    public off(event: string, callback?: (data: any) => void): void {
        this.socket.off(event, callback);
    }
}
