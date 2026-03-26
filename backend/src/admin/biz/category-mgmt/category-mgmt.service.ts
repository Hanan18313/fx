import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryMgmtService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async list() {
    const all = await this.categoryRepo.find({
      order: { sort: 'ASC', id: 'ASC' },
    });

    const map = new Map<number, any>();
    const roots: any[] = [];

    for (const cat of all) {
      map.set(cat.id, { ...cat, children: [] });
    }

    for (const cat of all) {
      const node = map.get(cat.id);
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId).children.push(node);
      } else if (!cat.parentId) {
        roots.push(node);
      }
    }

    return roots;
  }

  async create(dto: CreateCategoryDto) {
    const entity = this.categoryRepo.create(dto);
    return this.categoryRepo.save(entity);
  }

  async update(id: number, dto: Partial<CreateCategoryDto>) {
    const cat = await this.categoryRepo.findOneBy({ id });
    if (!cat) throw new BadRequestException('分类不存在');
    await this.categoryRepo.update(id, dto);
    return { message: '更新成功' };
  }

  async remove(id: number) {
    const children = await this.categoryRepo.findOneBy({ parentId: id });
    if (children) {
      throw new BadRequestException('该分类下存在子分类，无法删除');
    }
    await this.categoryRepo.delete(id);
    return { message: '删除成功' };
  }
}
