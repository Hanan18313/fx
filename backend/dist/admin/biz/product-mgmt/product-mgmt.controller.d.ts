import { ProductMgmtService } from './product-mgmt.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductMgmtController {
    private readonly productMgmtService;
    constructor(productMgmtService: ProductMgmtService);
    list(page?: number, pageSize?: number, name?: string, category?: string, status?: string): Promise<{
        list: import("../../../database/entities/product.entity").ProductEntity[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateProductDto): Promise<{
        message: string;
        id: number;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        message: string;
    }>;
    toggleStatus(id: number): Promise<{
        message: string;
        status: string;
    }>;
}
