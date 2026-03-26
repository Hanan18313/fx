import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    list(req: any, page?: string, limit?: string, type?: string): Promise<{
        data: import("../database/entities/notification.entity").NotificationEntity[];
        total: number;
        page: number;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    markAsRead(id: number, req: any): Promise<{
        message: string;
    }>;
}
