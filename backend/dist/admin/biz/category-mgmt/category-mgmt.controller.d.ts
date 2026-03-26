import { CategoryMgmtService } from './category-mgmt.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryMgmtController {
    private readonly categoryMgmtService;
    constructor(categoryMgmtService: CategoryMgmtService);
    list(): Promise<any[]>;
    create(dto: CreateCategoryDto): Promise<import("../../../database/entities/category.entity").CategoryEntity>;
    update(id: number, dto: CreateCategoryDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
