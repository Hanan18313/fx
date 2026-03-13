import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysDeptEntity } from '../../../database/entities/sys-dept.entity';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { buildTree } from '../utils/build-tree';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(SysDeptEntity)
    private readonly deptRepo: Repository<SysDeptEntity>,
  ) {}

  async list() {
    const depts = await this.deptRepo.find({ order: { sort: 'ASC' } });
    return buildTree(depts);
  }

  async create(dto: CreateDeptDto) {
    const parentId = dto.parentId ?? 0;

    // 计算 ancestors
    let ancestors = '0';
    if (parentId !== 0) {
      const parent = await this.deptRepo.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new Error('父部门不存在');
      }
      ancestors = parent.ancestors ? `${parent.ancestors},${parent.id}` : `${parent.id}`;
    }

    const dept = this.deptRepo.create({
      parentId,
      ancestors,
      name: dto.name,
      leader: dto.leader,
      phone: dto.phone,
      sort: dto.sort ?? 0,
      status: dto.status ?? 1,
    });

    const saved = await this.deptRepo.save(dept);
    return { id: saved.id };
  }

  async update(id: number, dto: UpdateDeptDto) {
    const dept = await this.deptRepo.findOne({ where: { id } });
    if (!dept) {
      throw new Error('部门不存在');
    }

    // 如果 parentId 变化，重新计算 ancestors
    if (dto.parentId !== undefined && dto.parentId !== dept.parentId) {
      const newParentId = dto.parentId;
      if (newParentId === 0) {
        dept.ancestors = '0';
      } else {
        const parent = await this.deptRepo.findOne({ where: { id: newParentId } });
        if (!parent) {
          throw new Error('父部门不存在');
        }
        dept.ancestors = parent.ancestors ? `${parent.ancestors},${parent.id}` : `${parent.id}`;
      }
      dept.parentId = newParentId;
    }

    if (dto.name !== undefined) dept.name = dto.name;
    if (dto.leader !== undefined) dept.leader = dto.leader;
    if (dto.phone !== undefined) dept.phone = dto.phone;
    if (dto.sort !== undefined) dept.sort = dto.sort;
    if (dto.status !== undefined) dept.status = dto.status;

    await this.deptRepo.save(dept);
    return { id };
  }

  async delete(id: number) {
    const dept = await this.deptRepo.findOne({ where: { id } });
    if (!dept) {
      throw new Error('部门不存在');
    }

    // 检查是否有子部门
    const children = await this.deptRepo.findOne({ where: { parentId: id } });
    if (children) {
      throw new Error('存在子部门，无法删除');
    }

    await this.deptRepo.delete(id);
    return { id };
  }
}
