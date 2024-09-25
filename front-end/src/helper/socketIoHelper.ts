import { jwtDecode } from 'jwt-decode';
import { Socket, io } from 'socket.io-client';

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
      extraHeaders: {
        userId: this.userId,
        token,
      },
    });
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

  public getSocketInstance(): Socket {
    return this.socket;
  }
}

// Singleton instance
let socketIoHelper: SocketIoHelper | null = null;

export const getSocketIoHelperInstance = (): SocketIoHelper => {
  if (!socketIoHelper) {
    socketIoHelper = new SocketIoHelper(import.meta.env.VITE_SOCKET_URL as string);
  }
  return socketIoHelper;
};
