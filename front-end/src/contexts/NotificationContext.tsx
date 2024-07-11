// NotificationContext.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketIoHelper } from '../helper/socketIoHelper'; // Adjust path as per your project structure

const SOCKET_SERVER_URL = 'http://localhost:5001'; // Replace with your actual backend URL

// Define the shape of our context
interface NotificationContextProps {
    sendNotification: (message: string, recipientUserId: string) => void;
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Create a provider component
const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const socketIoHelper = new SocketIoHelper(SOCKET_SERVER_URL, 'user_id'); // Replace 'user_id' with actual user ID

    const sendNotification = (message: string, recipientUserId: string) => {
        socketIoHelper.emit('notification', { message, recipientUserId });
    };

    useEffect(() => {
        socketIoHelper.on('notification', (data: { message: string }) => {
            toast(data.message);
        });

        return () => {
            socketIoHelper.off('notification');
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ sendNotification }}>
            {children}
            <ToastContainer />
        </NotificationContext.Provider>
    );
};

// Custom hook to use the NotificationContext
const useNotifications = (): NotificationContextProps => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export { NotificationProvider, useNotifications };
