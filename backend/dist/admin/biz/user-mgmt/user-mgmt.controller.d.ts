import { UserMgmtService } from './user-mgmt.service';
export declare class UserMgmtController {
    private readonly userMgmtService;
    constructor(userMgmtService: UserMgmtService);
    list(page?: number, pageSize?: number, phone?: string, nickname?: string, role?: string, status?: string): Promise<{
        list: import("../../../database/entities/user.entity").UserEntity[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    update(id: number, body: {
        status?: number;
        role?: string;
    }): Promise<{
        message: string;
    }>;
}
