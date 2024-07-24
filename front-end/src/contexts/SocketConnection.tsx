import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSocketIoHelperInstance } from '../helper/socketIoHelper'; // Adjust the import path as needed
import { Socket } from 'socket.io-client'; // Import Socket type
import { useNotifications } from './NotificationContext'; // Adjust the import path as needed
import { useLoadingSpinner } from './LoadingSpinnerContext'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom'; // For navigation

interface SocketConnectionContextType {
    socket: Socket | null;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    sendMessage: (message: string) => void; // Expose methods to interact with the socket
}

const SocketConnectionContext = createContext<SocketConnectionContextType | undefined>(undefined);

export const SocketConnectionProvider: React.FC<{ children: ReactNode, serverUrl: string }> = ({ children, serverUrl }) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook for navigation
    let socket: Socket | null = null;

    const { sendNotification } = useNotifications();
    const { startLoading, stopLoading } = useLoadingSpinner();

    useEffect(() => {
        try {
            const socketIoHelper = getSocketIoHelperInstance(serverUrl);
            socket = socketIoHelper.getSocket();
        } catch (error: any) {
            setError(error.message);
            navigate('/login'); // Redirect to login page if there's an error
            return;
        }

        const handleConnect = () => {
            setIsConnected(true);
            setIsLoading(false);
            setError(null);
            stopLoading(); // Stop loading spinner when connected
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            setIsLoading(true);
            startLoading(); // Start loading spinner when disconnected
        };

        const handleError = (error: Error) => {
            setError(`Connection error: ${error.message}`);
            setIsConnected(false);
            setIsLoading(true);
            sendNotification(`Connection error: ${error.message}`);
            startLoading(); // Start loading spinner on error
        };

        const handleReconnectError = (error: Error) => {
            setError(`Reconnect error: ${error.message}`);
            setIsConnected(false);
            setIsLoading(true);
            sendNotification(`Reconnect error: ${error.message}`);
            startLoading(); // Start loading spinner on reconnect error
        };

        socket?.on('connect', handleConnect);
        socket?.on('disconnect', handleDisconnect);
        socket?.on('error', handleError);
        socket?.on('reconnect_error', handleReconnectError);

        // Initial connection check
        const checkConnection = () => {
            socket?.connect();
            setTimeout(() => {
                if (!socket?.connected) {
                    setError('Server is not reachable.');
                    setIsLoading(true);
                    sendNotification('Server is not reachable.');
                    startLoading(); // Start loading spinner if server is unreachable
                }
            }, 5000); // Adjust timeout as needed
        };

        checkConnection();

        // Clean up on unmount
        return () => {
            socket?.off('connect', handleConnect);
            socket?.off('disconnect', handleDisconnect);
            socket?.off('error', handleError);
            socket?.off('reconnect_error', handleReconnectError);
        };
    }, [serverUrl, sendNotification, startLoading, stopLoading, navigate]);

    const sendMessage = (message: string) => {
        if (socket) {
            socket.emit('message', { content: message });
        }
    };

    return (
        <SocketConnectionContext.Provider value={{ socket, isConnected, isLoading, error, sendMessage }}>
            {children}
        </SocketConnectionContext.Provider>
    );
};

export const useSocketConnection = (): SocketConnectionContextType => {
    const context = useContext(SocketConnectionContext);
    if (!context) {
        throw new Error('useSocketConnection must be used within a SocketConnectionProvider');
    }
    return context;
};
