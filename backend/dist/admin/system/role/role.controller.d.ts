import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignMenusDto } from './dto/assign-menus.dto';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    list(): Promise<import("../../../database/entities/sys-role.entity").SysRoleEntity[]>;
    create(dto: CreateRoleDto): Promise<{
        id: number;
    }>;
    update(id: number, dto: UpdateRoleDto): Promise<{
        id: number;
    }>;
    assignMenus(id: number, dto: AssignMenusDto): Promise<{
        roleId: number;
        menuIds: number[];
    }>;
}
