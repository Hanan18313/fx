import { FavoriteService } from './favorite.service';
export declare class FavoriteController {
    private readonly favoriteService;
    constructor(favoriteService: FavoriteService);
    list(req: any): Promise<{
        data: {
            productId: number;
            name: string;
            price: number;
            originalPrice: number;
            images: string[];
            tag: string;
        }[];
    }>;
    add(req: any, productId: number): Promise<{
        message: string;
    }>;
    remove(req: any, productId: number): Promise<{
        message: string;
    }>;
}
