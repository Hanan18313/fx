import { FavoriteService } from './favorite.service';
export declare class FavoriteController {
    private readonly favoriteService;
    constructor(favoriteService: FavoriteService);
    list(req: any): Promise<{
        data: {
            id: number;
            product_id: number;
            created_at: Date;
            product: import("../database/entities/product.entity").ProductEntity;
        }[];
    }>;
    add(req: any, productId: number): Promise<{
        message: string;
    }>;
    remove(req: any, productId: number): Promise<{
        message: string;
    }>;
}
