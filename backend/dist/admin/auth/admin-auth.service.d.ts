import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SysAdminEntity } from '../../database/entities/sys-admin.entity';
import { SysLoginLogEntity } from '../../database/entities/sys-login-log.entity';
import { TokenBlacklistService } from '../../common/services/token-blacklist.service';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AdminAuthService {
    private readonly adminRepo;
    private readonly loginLogRepo;
    private readonly jwtService;
    private readonly dataSource;
    private readonly tokenBlacklistService;
    constructor(adminRepo: Repository<SysAdminEntity>, loginLogRepo: Repository<SysLoginLogEntity>, jwtService: JwtService, dataSource: DataSource, tokenBlacklistService: TokenBlacklistService);
    login(dto: AdminLoginDto, ip?: string, userAgent?: string): Promise<{
        token: string;
    }>;
    logout(token: string, adminId: number, username: string, ip?: string, userAgent?: string): Promise<void>;
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
    private buildTree;
}
