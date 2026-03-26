import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryMgmtService {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<CategoryEntity>);
    list(): Promise<any[]>;
    create(dto: CreateCategoryDto): Promise<CategoryEntity>;
    update(id: number, dto: Partial<CreateCategoryDto>): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
