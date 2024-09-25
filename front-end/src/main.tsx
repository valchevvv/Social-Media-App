import React from 'react';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingSpinnerProvider } from './contexts/LoadingSpinnerContext';
import { ModalProvider } from './contexts/ModalContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SidebarProvider } from './contexts/SidebarContext';
import './index.css';
import ReactDOM from 'react-dom/client';
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      },
      error => {
        console.log('ServiceWorker registration failed: ', error);
      },
    );
  });
}

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
  </React.StrictMode>,
);
