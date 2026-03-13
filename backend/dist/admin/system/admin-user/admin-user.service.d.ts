import { Repository, DataSource } from "typeorm";
import { SysAdminEntity } from "../../../database/entities/sys-admin.entity";
import { SysAdminRoleEntity } from "../../../database/entities/sys-admin-role.entity";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
export declare class AdminUserService {
    private readonly adminRepo;
    private readonly adminRoleRepo;
    private readonly dataSource;
    constructor(adminRepo: Repository<SysAdminEntity>, adminRoleRepo: Repository<SysAdminRoleEntity>, dataSource: DataSource);
    list(query: {
        page?: number;
        pageSize?: number;
        username?: string;
        realName?: string;
        phone?: string;
        status?: number;
        deptId?: number;
    }): Promise<{
        list: any;
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateAdminDto, createdBy: number): Promise<{
        id: number;
    }>;
    update(id: number, dto: UpdateAdminDto): Promise<{
        id: number;
    }>;
    resetPassword(id: number, newPassword: string): Promise<{
        id: number;
    }>;
}
