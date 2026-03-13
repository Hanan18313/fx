import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysMenuEntity } from '../../../database/entities/sys-menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { buildTree } from '../utils/build-tree';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SysMenuEntity)
    private readonly menuRepo: Repository<SysMenuEntity>,
  ) {}

  async list() {
    const menus = await this.menuRepo.find({ order: { sort: 'ASC' } });
    return buildTree(menus);
  }

  async create(dto: CreateMenuDto) {
    const menu = this.menuRepo.create({
      parentId: dto.parentId ?? 0,
      name: dto.name,
      type: dto.type,
      permission: dto.permission,
      path: dto.path,
      component: dto.component,
      icon: dto.icon,
      sort: dto.sort ?? 0,
      visible: dto.visible ?? 1,
      status: dto.status ?? 1,
    });
    const saved = await this.menuRepo.save(menu);
    return { id: saved.id };
  }

  async update(id: number, dto: UpdateMenuDto) {
    const menu = await this.menuRepo.findOne({ where: { id } });
    if (!menu) {
      throw new Error('菜单不存在');
    }

    if (dto.parentId !== undefined) menu.parentId = dto.parentId;
    if (dto.name !== undefined) menu.name = dto.name;
    if (dto.type !== undefined) menu.type = dto.type;
    if (dto.permission !== undefined) menu.permission = dto.permission;
    if (dto.path !== undefined) menu.path = dto.path;
    if (dto.component !== undefined) menu.component = dto.component;
    if (dto.icon !== undefined) menu.icon = dto.icon;
    if (dto.sort !== undefined) menu.sort = dto.sort;
    if (dto.visible !== undefined) menu.visible = dto.visible;
    if (dto.status !== undefined) menu.status = dto.status;

    await this.menuRepo.save(menu);
    return { id };
  }

  async delete(id: number) {
    const menu = await this.menuRepo.findOne({ where: { id } });
    if (!menu) {
      throw new Error('菜单不存在');
    }

    // 检查是否有子菜单
    const children = await this.menuRepo.findOne({ where: { parentId: id } });
    if (children) {
      throw new Error('存在子菜单，无法删除');
    }

    await this.menuRepo.delete(id);
    return { id };
  }
}
