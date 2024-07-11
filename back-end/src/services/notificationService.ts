import { INotification, Notification } from '../models/Notification';

export class NotificationService {
    static async getAllNotifications(): Promise<INotification[]> {
        return Notification.find().exec();
    }

    static async getNotificationById(id: string): Promise<INotification | null> {
        return Notification.findById(id).exec();
    }

    static async createNotification(data: Partial<INotification>): Promise<INotification> {
        const notification = new Notification(data);
        return notification.save();
    }

    static async updateNotification(id: string, data: Partial<INotification>): Promise<INotification | null> {
        return Notification.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    static async deleteNotification(id: string): Promise<INotification | null> {
        return Notification.findByIdAndDelete(id).exec();
    }
}
