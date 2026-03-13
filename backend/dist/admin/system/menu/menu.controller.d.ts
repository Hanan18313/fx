import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    list(): Promise<(import("../../../database/entities/sys-menu.entity").SysMenuEntity & {
        children: import("../../../database/entities/sys-menu.entity").SysMenuEntity[];
    })[]>;
    create(dto: CreateMenuDto): Promise<{
        id: number;
    }>;
    update(id: number, dto: UpdateMenuDto): Promise<{
        id: number;
    }>;
    delete(id: number): Promise<{
        id: number;
    }>;
}
