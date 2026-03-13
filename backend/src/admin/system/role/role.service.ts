import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysRoleEntity } from '../../../database/entities/sys-role.entity';
import { SysRoleMenuEntity } from '../../../database/entities/sys-role-menu.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(SysRoleEntity)
    private readonly roleRepo: Repository<SysRoleEntity>,
    @InjectRepository(SysRoleMenuEntity)
    private readonly roleMenuRepo: Repository<SysRoleMenuEntity>,
  ) {}

  async list() {
    return this.roleRepo.find({ order: { sort: 'ASC' } });
  }

  async create(dto: CreateRoleDto) {
    const role = this.roleRepo.create({
      name: dto.name,
      code: dto.code,
      description: dto.description,
      dataScope: dto.dataScope,
      sort: dto.sort ?? 0,
      status: dto.status ?? 1,
    });
    const saved = await this.roleRepo.save(role);
    return { id: saved.id };
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new Error('角色不存在');
    }

    if (dto.name !== undefined) role.name = dto.name;
    if (dto.code !== undefined) role.code = dto.code;
    if (dto.description !== undefined) role.description = dto.description;
    if (dto.dataScope !== undefined) role.dataScope = dto.dataScope;
    if (dto.sort !== undefined) role.sort = dto.sort;
    if (dto.status !== undefined) role.status = dto.status;

    await this.roleRepo.save(role);
    return { id };
  }

  async assignMenus(roleId: number, menuIds: number[]) {
    // 删除旧的角色-菜单关系
    await this.roleMenuRepo.delete({ roleId });

    // 插入新的
    if (menuIds.length > 0) {
      const roleMenus = menuIds.map((menuId) =>
        this.roleMenuRepo.create({ roleId, menuId }),
      );
      await this.roleMenuRepo.save(roleMenus);
    }

    return { roleId, menuIds };
  }
}
