import { AdminUserService } from "./admin-user.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
export declare class AdminUserController {
    private readonly adminUserService;
    constructor(adminUserService: AdminUserService);
    list(page?: number, pageSize?: number, username?: string, realName?: string, phone?: string, status?: number, deptId?: number): Promise<{
        list: any;
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateAdminDto, adminId: number): Promise<{
        id: number;
    }>;
    update(id: number, dto: UpdateAdminDto): Promise<{
        id: number;
    }>;
    resetPassword(id: number, password: string): Promise<{
        id: number;
    }>;
}
