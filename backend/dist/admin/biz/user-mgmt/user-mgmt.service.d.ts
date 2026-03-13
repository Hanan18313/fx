import { Repository } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
export declare class UserMgmtService {
    private readonly userRepo;
    constructor(userRepo: Repository<UserEntity>);
    list(params: {
        page: number;
        pageSize: number;
        phone?: string;
        nickname?: string;
        role?: string;
        status?: number;
    }): Promise<{
        list: UserEntity[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    update(id: number, data: {
        status?: number;
        role?: string;
    }): Promise<{
        message: string;
    }>;
}
