// NotificationContext.tsx
import React, { ReactNode, createContext, useContext } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the shape of our context
interface NotificationContextProps {
  sendNotification: (message: string) => void;
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Create a provider component
const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Function to send notification
  const sendNotification = (message: string) => {
    toast(message);
  };

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
