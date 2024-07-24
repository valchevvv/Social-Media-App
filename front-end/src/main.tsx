import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'
import { SidebarProvider } from './contexts/SidebarContext';
import { LoadingSpinnerProvider } from './contexts/LoadingSpinnerContext';
import { ModalProvider } from './contexts/ModalContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SocketConnectionProvider } from './contexts/SocketConnection';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <LoadingSpinnerProvider>
        <NotificationProvider>
          <ModalProvider>
            <SidebarProvider>
              <SocketConnectionProvider serverUrl={"http://localhost:5001"}>
                <App />
              </SocketConnectionProvider>
            </SidebarProvider>
          </ModalProvider>
        </NotificationProvider>
      </LoadingSpinnerProvider>
    </AuthProvider>
  </React.StrictMode>
);