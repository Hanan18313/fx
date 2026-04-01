import { Repository } from 'typeorm';
import { FavoriteEntity } from '../database/entities/favorite.entity';
import { ProductEntity } from '../database/entities/product.entity';
export declare class FavoriteService {
    private readonly favoriteRepo;
    private readonly productRepo;
    constructor(favoriteRepo: Repository<FavoriteEntity>, productRepo: Repository<ProductEntity>);
    list(userId: number): Promise<{
        data: {
            productId: number;
            name: string;
            price: number;
            originalPrice: number;
            images: string[];
            tag: string;
        }[];
    }>;
    add(userId: number, productId: number): Promise<{
        message: string;
    }>;
    remove(userId: number, productId: number): Promise<{
        message: string;
    }>;
}
