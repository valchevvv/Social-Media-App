// src/notificationHelper.ts
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message: string) => {
  toast.success(message);
};

export const notifyError = (message: string) => {
  toast.error(message);
};

export const notifyInfo = (message: string) => {
  toast.info(message);
};

export const notifyWarning = (message: string) => {
  toast.warn(message);
};
