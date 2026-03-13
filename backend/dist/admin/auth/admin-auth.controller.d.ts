import { Request } from "express";
import { AdminAuthService } from "./admin-auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
export declare class AdminAuthController {
    private readonly adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    login(dto: AdminLoginDto, req: Request): Promise<{
        token: string;
    }>;
    logout(adminId: number, username: string, req: Request): Promise<{
        message: string;
    }>;
    getProfile(adminId: number): Promise<{
        id: number;
        username: string;
        realName: string;
        email: string;
        phone: string;
        avatar: string;
        deptId: number;
        permissions: string[];
        menus: any[];
    }>;
}
