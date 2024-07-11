import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';

export class NotificationController {
    static async getAllNotifications(req: Request, res: Response) {
        try {
            const notifications = await NotificationService.getAllNotifications();
            res.status(200).json(notifications);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async getNotificationById(req: Request, res: Response) {
        try {
            const notification = await NotificationService.getNotificationById(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json(notification);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async createNotification(req: Request, res: Response) {
        try {
            const notification = await NotificationService.createNotification(req.body);
            res.status(201).json(notification);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async updateNotification(req: Request, res: Response) {
        try {
            const notification = await NotificationService.updateNotification(req.params.id, req.body);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json(notification);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async deleteNotification(req: Request, res: Response) {
        try {
            const notification = await NotificationService.deleteNotification(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }
}
