import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getTree(): Promise<{
        data: any[];
    }>;
    getQuick(): Promise<{
        data: import("../database/entities/category.entity").CategoryEntity[];
    }>;
}
