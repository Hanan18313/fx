import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CategoryEntity } from '../database/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async getTree() {
    const all = await this.categoryRepo.find({
      where: { status: 1 },
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

    return { data: roots };
  }

  async getQuick() {
    const data = await this.categoryRepo.find({
      where: { parentId: IsNull(), status: 1 },
      order: { sort: 'ASC' },
      select: ['id', 'name', 'icon'],
    });
    return { data };
  }
}
