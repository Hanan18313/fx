import { NotificationMgmtService } from './notification-mgmt.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationMgmtController {
    private readonly notificationMgmtService;
    constructor(notificationMgmtService: NotificationMgmtService);
    list(page?: number, pageSize?: number, type?: string): Promise<{
        list: {
            userPhone: any;
            id: number;
            userId: number;
            type: string;
            title: string;
            content: string;
            isRead: number;
            linkType: string;
            linkValue: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateNotificationDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
