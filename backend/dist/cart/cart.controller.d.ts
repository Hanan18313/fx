import { CartService } from './cart.service';
import { UpsertCartDto } from './dto/upsert-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    list(req: any): Promise<{
        data: {
            id: number;
            productId: number;
            quantity: number;
            spec: string;
            selected: number;
            product: import("../database/entities/product.entity").ProductEntity;
        }[];
    }>;
    add(req: any, dto: UpsertCartDto): Promise<{
        id: number;
    }>;
    updateQuantity(req: any, itemId: number, quantity: number): Promise<{}>;
    clear(req: any): Promise<{}>;
    remove(req: any, itemId: number): Promise<{}>;
}
