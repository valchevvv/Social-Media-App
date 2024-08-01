import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { SidebarProvider } from './contexts/SidebarContext';
import { LoadingSpinnerProvider } from './contexts/LoadingSpinnerContext';
import { ModalProvider } from './contexts/ModalContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    const userConfirmed = window.confirm('New content is available, click OK to refresh.');
    if (userConfirmed) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('The app is ready to work offline.');
  },
});

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
