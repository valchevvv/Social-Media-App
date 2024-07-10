import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'
import { SidebarProvider } from './contexts/SidebarContext';
import { LoadingSpinnerProvider } from './contexts/LoadingSpinnerContext';
import { ModalProvider } from './contexts/ModalContext';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <LoadingSpinnerProvider>
        <ModalProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </ModalProvider>
      </LoadingSpinnerProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        draggable
        closeButton={false}
      />
    </AuthProvider>
  </React.StrictMode>
);