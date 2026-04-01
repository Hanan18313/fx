import { Repository } from "typeorm";
import { ProductEntity } from "../database/entities/product.entity";
export declare class ShopService {
    private readonly productRepo;
    constructor(productRepo: Repository<ProductEntity>);
    getProducts(page?: number, limit?: number, keyword?: string, categoryId?: number): Promise<{
        data: ProductEntity[];
        total: number;
        page: number;
    }>;
    getProduct(id: number): Promise<ProductEntity>;
}
