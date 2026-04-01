import { ShopService } from './shop.service';
export declare class ShopController {
    private readonly shopService;
    constructor(shopService: ShopService);
    getProducts(page?: string, limit?: string, keyword?: string, categoryId?: string): Promise<{
        data: import("../database/entities/product.entity").ProductEntity[];
        total: number;
        page: number;
    }>;
    getProduct(id: number): Promise<import("../database/entities/product.entity").ProductEntity>;
}
