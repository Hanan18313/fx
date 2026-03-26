import { Repository } from 'typeorm';
import { NotificationEntity } from '../../../database/entities/notification.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationMgmtService {
    private readonly notifRepo;
    private readonly userRepo;
    constructor(notifRepo: Repository<NotificationEntity>, userRepo: Repository<UserEntity>);
    list(params: {
        page: number;
        pageSize: number;
        type?: string;
    }): Promise<{
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
