// socketIoHelper.ts
import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { notifyInfo } from './notificationHelper';

interface DecodedToken {
    _id: string;
    exp: number;
    iat: number;
}

const debug = false;

export class SocketIoHelper {
    private socket: Socket | null = null;
    private userId: string | null = null;
    private token: string | null = null;

    constructor(serverUrl: string) {
        try {
            this.token = localStorage.getItem('userToken');

            if (!this.token) {
                throw new Error('Token not found. Please log in.');
            }

            const decodedUser = jwtDecode<DecodedToken>(this.token);

            if (!decodedUser || !decodedUser._id) {
                throw new Error('Invalid token. Please log in.');
            }

            this.userId = decodedUser._id;

            this.socket = io(serverUrl, {
                query: {
                    userId: this.userId,
                    token: this.token,
                },
            });

            this.setupListeners();
            this.emitLogin(this.userId, this.token); // Automatically emit login event upon construction
        } catch (error) {
            // Redirect to login page or handle error appropriately
            window.location.href = '/login';
        }
    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    private setupListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            if (debug) console.log('Connected to server');
        });

        this.socket.on('disconnect', () => {
            if (debug) console.log('Disconnected from server');
        });

        this.socket.on('notification', (data) => {
            if (debug) console.log('Notification received:', data);
        });

        this.socket.on('authorized', () => {
            if (debug) console.log('Authorization successful');
        });

        this.socket.on('unauthorized', (message: string) => {
            if (debug) console.log('Authorization failed:', message);
        });

        this.socket.on('followed_f', this.handleFollowedEvent.bind(this));
        this.socket.on('liked_f', this.handleLikedEvent.bind(this));
        this.socket.on('commented_f', this.handleCommentedEvent.bind(this));
    }

    private handleFollowedEvent(data: { sender: string; reciever: string; followStatus: string; notifyDetails: {
        follow: boolean;
        followed: boolean;
        sender: {
            id: string;
            username: string;
        };
        reciever: {
            id: string;
            username: string;
        };
    }}) {
        if (debug) console.log('Followed event received:', data);

        if (data.reciever === this.userId) {
            const { sender, followStatus, notifyDetails } = data;
            const followMessage = notifyDetails.follow ? 'followed you back' : 
                (followStatus === 'followed' ? 'started following you' : 'stopped following you');
            notifyInfo(`${sender.username} ${followMessage}`);
        }
    }

    private handleLikedEvent(data: { sender: { id: string; username: string }; post: string }) {
        if (debug) console.log('Liked event received:', data);

        if (data.sender.id !== this.userId) {
            notifyInfo(`${data.sender.username} liked your post`);
        }
    }

    private handleCommentedEvent(data: { sender: { id: string; username: string } }) {
        if (debug) console.log('Commented event received:', data);

        if (data.sender.id !== this.userId) {
            notifyInfo(`${data.sender.username} commented on your post`);
        }
    }

    private emitLogin(userId: string, token: string): void {
        if (!this.socket) return;
        this.socket.emit('login', { userId, token });
        if (debug) console.log('Login emitted with userId and token:', userId, token);
    }

    public emit(event: string, data: any): void {
        if (!this.socket) return;
        this.socket.emit(event, data);
    }

    public follow(followId: string): void {
        if (!this.socket || !this.userId) return;
        this.socket.emit('follow_b', { userId: this.userId, followId });
    }

    public on(event: string, callback: (data: any) => void): void {
        if (!this.socket) return;
        this.socket.on(event, callback);
    }

    public off(event: string, callback?: (data: any) => void): void {
        if (!this.socket) return;
        this.socket.off(event, callback);
    }
}

// Singleton instance to ensure only one socket connection throughout the application
let socketIoHelper: SocketIoHelper | null = null;

export const getSocketIoHelperInstance = (serverUrl: string): SocketIoHelper => {
    if (!socketIoHelper) {
        socketIoHelper = new SocketIoHelper(serverUrl);
    }
    return socketIoHelper;
};
