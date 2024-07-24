import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    _id: string;
    exp: number;
    iat: number;
}

export class SocketIoHelper {
    private socket: Socket;
    private userId: string;

    constructor(serverUrl: string) {
        const token = localStorage.getItem('userToken');

        if (!token) {
            throw new Error('Token not found. Please log in.');
        }

        const decodedUser = jwtDecode<DecodedToken>(token);

        if (!decodedUser || !decodedUser._id) {
            throw new Error('Invalid token. Please log in.');
        }

        this.userId = decodedUser._id;

        this.socket = io(serverUrl, {
            query: {
                userId: this.userId,
                token,
            },
        });

        // Emit login event when connected
        this.socket.on('connect', () => {
            this.emit('login', { userId: this.userId, token });
        });
    }

    public emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }

    public follow(followId: string): void {
        this.socket.emit('follow_b', { userId: this.userId, followId });
    }

    public on(event: string, callback: (data: any) => void): void {
        this.socket.on(event, callback);
    }

    public off(event: string, callback?: (data: any) => void): void {
        this.socket.off(event, callback);
    }

    public getSocketInstance(): Socket {
        return this.socket;
    }
}

// Singleton instance
let socketIoHelper: SocketIoHelper | null = null;

export const getSocketIoHelperInstance = (): SocketIoHelper => {
    if (!socketIoHelper) {
        socketIoHelper = new SocketIoHelper("http://localhost:5001");
    }
    return socketIoHelper;
};
