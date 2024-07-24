import { useEffect, useState } from 'react';
import { SocketIoHelper, getSocketIoHelperInstance } from '../helper/socketIoHelper';
import { notifyInfo } from '../helper/notificationHelper';

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

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 3; // Adjust the number of retries as needed
        const retryDelay = 5000; // Delay between retries in milliseconds

        const initializeSocket = () => {
            try {
                const helper = getSocketIoHelperInstance();
                setSocket(helper);

                const socketInstance = helper.getSocketInstance();

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
                helper.on('notification', (data) => {
                    console.log('notification received:', data);
                });

                helper.on('authorized', () => {
                    console.log('Authorization successful');
                });

                helper.on('unauthorized', (message: string) => {
                    console.log('Authorization failed:', message);
                });

                helper.on('followed_f', (data: { sender: string; reciever: string; followStatus: string; notifyDetails: { follow: boolean; followed: boolean; sender: { id: string; username: string }; reciever: { id: string; username: string } } }) => {
                    if (data.reciever === helper['userId']) {
                        if (data.followStatus === 'followed' && data.notifyDetails.follow) {
                            notifyInfo(`${data.notifyDetails.sender.username} followed you back`);
                        } else {
                            notifyInfo(`${data.notifyDetails.sender.username} ${(data.followStatus === 'followed' ? 'started' : 'stopped')} following you`);
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

                // Clean up on unmount
                return () => {
                    socketInstance.off('connect');
                    socketInstance.off('disconnect');
                    socketInstance.off('connect_error');
                    helper.off('notification');
                    helper.off('authorized');
                    helper.off('unauthorized');
                    helper.off('followed_f');
                    helper.off('liked_f');
                    helper.off('commented_f');
                };
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
        };
    }, []);

    return {
        socket,
        isLoading,
        isError,
        isConnected
    };
};
