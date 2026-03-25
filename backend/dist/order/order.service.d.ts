import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '../database/entities/order.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { UserEntity } from '../database/entities/user.entity';
import { PromotionService } from '../promotion/promotion.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderService {
    private readonly orderRepo;
    private readonly productRepo;
    private readonly userRepo;
    private readonly dataSource;
    private readonly promotionService;
    constructor(orderRepo: Repository<OrderEntity>, productRepo: Repository<ProductEntity>, userRepo: Repository<UserEntity>, dataSource: DataSource, promotionService: PromotionService);
    createOrder(userId: number, dto: CreateOrderDto): Promise<{
        order_id: number;
        total_amount: number;
        profit_pool: number;
    }>;
    payOrder(orderId: number, userId: number): Promise<{
        message: string;
    }>;
    getOrders(userId: number): Promise<{
        data: OrderEntity[];
    }>;
}
