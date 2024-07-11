// NotificationContext.tsx
import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketIoHelper } from '../helper/socketIoHelper'; // Adjust path as per your project structure
import { jwtDecode, JwtPayload } from 'jwt-decode';

const SOCKET_SERVER_URL = 'http://localhost:5001'; // Replace with your actual backend URL

// Define the shape of our context
interface NotificationContextProps {
    sendNotification: (message: string, recipientUserId: string) => void;
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Create a provider component
const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const token = localStorage.getItem('userToken');
    const [socketIoHelper, setSocketIoHelper] = useState<SocketIoHelper | null>(null); // Use null initially

    useEffect(() => {
        if (!token) {
            setSocketIoHelper(null); // No token, set socketIoHelper to null
            return;
        }

        const decodedUser = jwtDecode<JwtPayload>(token || "");
        if (decodedUser) {
            const newSocketIoHelper = new SocketIoHelper(SOCKET_SERVER_URL, decodedUser._id);
            setSocketIoHelper(newSocketIoHelper); // Set the new socketIoHelper instance
        }
    }, [token]);

    const sendNotification = (message: string, recipientUserId: string) => {
        if (socketIoHelper) {
            socketIoHelper.emit('notification', { message, recipientUserId });
        } else {
            console.error('Socket not initialized. User token is missing or invalid.');
            // Handle this case as needed, e.g., show error message
        }
    };

    useEffect(() => {
        if (socketIoHelper) {
            socketIoHelper.on('notification', (data: { message: string }) => {
                toast(data.message);
            });

            return () => {
                socketIoHelper.off('notification');
            };
        }
    }, [socketIoHelper]); // Depend on socketIoHelper to recreate listener on change

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
