import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'
import { SidebarProvider } from './contexts/SidebarContext';
import { LoadingSpinnerProvider } from './contexts/LoadingSpinnerContext';
import { ModalProvider } from './contexts/ModalContext';
import { NotificationProvider } from './contexts/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <LoadingSpinnerProvider>
        <NotificationProvider>
          <ModalProvider>
            <SidebarProvider>
              <App />
            </SidebarProvider>
          </ModalProvider>
        </NotificationProvider>
      </LoadingSpinnerProvider>
    </AuthProvider>
  </React.StrictMode>
);
