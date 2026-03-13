import { Repository } from 'typeorm';
import { SysMenuEntity } from '../../../database/entities/sys-menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenuService {
    private readonly menuRepo;
    constructor(menuRepo: Repository<SysMenuEntity>);
    list(): Promise<(SysMenuEntity & {
        children: SysMenuEntity[];
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
