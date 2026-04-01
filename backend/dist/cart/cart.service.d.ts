import { Repository, DataSource } from 'typeorm';
import { CartItemEntity } from '../database/entities/cart-item.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { UpsertCartDto } from './dto/upsert-cart.dto';
export declare class CartService {
    private readonly cartRepo;
    private readonly productRepo;
    private readonly dataSource;
    constructor(cartRepo: Repository<CartItemEntity>, productRepo: Repository<ProductEntity>, dataSource: DataSource);
    list(userId: number): Promise<{
        data: {
            id: number;
            productId: number;
            quantity: number;
            spec: string;
            selected: number;
            product: ProductEntity;
        }[];
    }>;
    add(userId: number, dto: UpsertCartDto): Promise<{
        id: number;
    }>;
    updateQuantity(userId: number, itemId: number, quantity: number): Promise<{}>;
    remove(userId: number, itemId: number): Promise<{}>;
    clear(userId: number): Promise<{}>;
}
