import { Repository } from 'typeorm';
import { ProductEntity } from '../../../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductMgmtService {
    private readonly productRepo;
    constructor(productRepo: Repository<ProductEntity>);
    list(params: {
        page: number;
        pageSize: number;
        name?: string;
        category?: string;
        status?: string;
    }): Promise<{
        list: ProductEntity[];
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
    private validateProductData;
}
