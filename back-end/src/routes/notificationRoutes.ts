import express from 'express';
import { NotificationController } from '../controllers/notificationController';

const router = express.Router();

router.get('/notifications', NotificationController.getAllNotifications);
router.get('/notifications/:id', NotificationController.getNotificationById);
router.post('/notifications', NotificationController.createNotification);
router.put('/notifications/:id', NotificationController.updateNotification);
router.delete('/notifications/:id', NotificationController.deleteNotification);

export default router;
