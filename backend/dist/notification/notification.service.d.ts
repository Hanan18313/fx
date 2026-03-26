import { Repository } from 'typeorm';
import { NotificationEntity } from '../database/entities/notification.entity';
export declare class NotificationService {
    private readonly notificationRepo;
    constructor(notificationRepo: Repository<NotificationEntity>);
    list(userId: number, page?: number, limit?: number, type?: string): Promise<{
        data: NotificationEntity[];
        total: number;
        page: number;
    }>;
    markAsRead(id: number, userId: number): Promise<{
        message: string;
    }>;
    markAllAsRead(userId: number): Promise<{
        message: string;
    }>;
}
