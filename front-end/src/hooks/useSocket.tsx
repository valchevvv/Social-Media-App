import { useEffect, useState, useRef } from 'react';
import { SocketIoHelper, getSocketIoHelperInstance } from '../helper/socketIoHelper';
import { notifyError, notifyInfo } from '../helper/notificationHelper';

export const useSocketIoHelper = (): {
    socket: SocketIoHelper | null;
    isLoading: boolean;
    isError: boolean;
    isConnected: boolean;
} => {
    const [socket, setSocket] = useState<SocketIoHelper | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Refs to hold persistent socket and helper instances
    const socketRef = useRef<SocketIoHelper | null>(null);
    const socketInstanceRef = useRef<any>(null);

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 3; // Adjust the number of retries as needed
        const retryDelay = 5000; // Delay between retries in milliseconds

        const initializeSocket = () => {
            try {
                if (socketRef.current) {
                    // Clean up existing listeners before creating new ones
                    socketInstanceRef.current?.off('connect');
                    socketInstanceRef.current?.off('disconnect');
                    socketInstanceRef.current?.off('connect_error');
                    socketRef.current?.off('notification');
                    socketRef.current?.off('authorized');
                    socketRef.current?.off('unauthorized');
                    socketRef.current?.off('followed_f');
                    socketRef.current?.off('liked_f');
                    socketRef.current?.off('commented_f');
                }

                const helper = getSocketIoHelperInstance();
                const socketInstance = helper.getSocketInstance();

                // Set references
                socketRef.current = helper;
                socketInstanceRef.current = socketInstance;

                setSocket(helper);

                // Check connection status
                socketInstance.on('connect', () => {
                    setIsConnected(true);
                    setIsError(false); // Reset error state on successful connection
                    retryCount = 0; // Reset retry count on successful connection
                });

                socketInstance.on('disconnect', () => {
                    setIsConnected(false);
                });

                // Handle connection errors
                socketInstance.on('connect_error', () => {
                    setIsError(true);
                    setIsConnected(false);

                    // Retry logic
                    if (retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(initializeSocket, retryDelay);
                    }
                });

                // Event listeners
                helper.on('notification_f', (data) => {
                    notifyInfo(data.message);
                });

                helper.on('authorized', () => {
                    
                });

                helper.on('unauthorized', (message: string) => {
                    notifyError('Authorization failed. Please log in again.');
                });

                helper.on('followed_f', (data: { sender: string; receiver: string; followStatus: string; notifyDetails: { follow: boolean; followed: boolean; sender: { id: string; username: string }; receiver: { id: string; username: string } } }) => {
                    if(data.receiver !== helper['userId']) return;
                    if(data.followStatus !== "followed") return;

                    if(data.notifyDetails.follow) {
                        if(data.notifyDetails.followed) {
                            notifyInfo(`${data.notifyDetails.sender.username} followed you back`);
                        } else {
                            notifyInfo(`${data.notifyDetails.sender.username} followed you`);
                        }
                    }
                    
                });

                helper.on('liked_f', (data: { sender: { id: string; username: string }; post: string }) => {
                    if (data.sender.id !== helper['userId']) {
                        notifyInfo(`${data.sender.username} liked your post`);
                    }
                });

                helper.on('commented_f', (data: { sender: { id: string; username: string } }) => {
                    if (data.sender.id !== helper['userId']) {
                        notifyInfo(`${data.sender.username} commented on your post`);
                    }
                });

            } catch (error) {
                console.error('Error initializing SocketIoHelper:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        initializeSocket();

        // Retry mechanism if the initial connection fails
        const retry = setInterval(() => {
            if (isError && retryCount < maxRetries) {
                retryCount++;
                initializeSocket();
            } else {
                clearInterval(retry);
            }
        }, retryDelay);

        return () => {
            clearInterval(retry);
            if (socketRef.current && socketInstanceRef.current) {
                socketInstanceRef.current.off('connect');
                socketInstanceRef.current.off('disconnect');
                socketInstanceRef.current.off('connect_error');
                socketRef.current.off('notification');
                socketRef.current.off('authorized');
                socketRef.current.off('unauthorized');
                socketRef.current.off('followed_f');
                socketRef.current.off('liked_f');
                socketRef.current.off('commented_f');
            }
        };
    }, []);

    return {
        socket,
        isLoading,
        isError,
        isConnected
    };
};
