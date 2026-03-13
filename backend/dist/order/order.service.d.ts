import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '../database/entities/order.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderService {
    private readonly orderRepo;
    private readonly productRepo;
    private readonly dataSource;
    constructor(orderRepo: Repository<OrderEntity>, productRepo: Repository<ProductEntity>, dataSource: DataSource);
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
