import { Repository } from 'typeorm';
import { CategoryEntity } from '../database/entities/category.entity';
export declare class CategoryService {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<CategoryEntity>);
    getTree(): Promise<{
        data: any[];
    }>;
    getQuick(): Promise<{
        data: CategoryEntity[];
    }>;
}
