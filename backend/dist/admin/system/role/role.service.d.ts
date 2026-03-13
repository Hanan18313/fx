import { Repository } from 'typeorm';
import { SysRoleEntity } from '../../../database/entities/sys-role.entity';
import { SysRoleMenuEntity } from '../../../database/entities/sys-role-menu.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RoleService {
    private readonly roleRepo;
    private readonly roleMenuRepo;
    constructor(roleRepo: Repository<SysRoleEntity>, roleMenuRepo: Repository<SysRoleMenuEntity>);
    list(): Promise<SysRoleEntity[]>;
    create(dto: CreateRoleDto): Promise<{
        id: number;
    }>;
    update(id: number, dto: UpdateRoleDto): Promise<{
        id: number;
    }>;
    assignMenus(roleId: number, menuIds: number[]): Promise<{
        roleId: number;
        menuIds: number[];
    }>;
}
