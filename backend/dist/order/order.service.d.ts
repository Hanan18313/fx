import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '../database/entities/order.entity';
import { OrderItemEntity } from '../database/entities/order-item.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { UserEntity } from '../database/entities/user.entity';
import { AddressEntity } from '../database/entities/address.entity';
import { PromotionService } from '../promotion/promotion.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderService {
    private readonly orderRepo;
    private readonly orderItemRepo;
    private readonly productRepo;
    private readonly userRepo;
    private readonly addressRepo;
    private readonly dataSource;
    private readonly promotionService;
    constructor(orderRepo: Repository<OrderEntity>, orderItemRepo: Repository<OrderItemEntity>, productRepo: Repository<ProductEntity>, userRepo: Repository<UserEntity>, addressRepo: Repository<AddressEntity>, dataSource: DataSource, promotionService: PromotionService);
    createOrder(userId: number, dto: CreateOrderDto): Promise<{
        id: number;
        payAmount: number;
        totalAmount: number;
    }>;
    payOrder(orderId: number, userId: number): Promise<{
        payAmount: number;
        totalAmount: number;
    }>;
    getOrders(userId: number, status?: string, page?: number, limit?: number): Promise<{
        data: {
            items: OrderItemEntity[];
            id: number;
            orderNo: string;
            userId: number;
            totalAmount: number;
            freightAmount: number;
            discountAmount: number;
            payAmount: number;
            profitPool: number;
            status: string;
            payType: string;
            payTradeNo: string;
            remark: string;
            addressId: number;
            addressSnapshot: any;
            paidAt: Date;
            shippedAt: Date;
            completedAt: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
    }>;
    getOrderDetail(orderId: number, userId: number): Promise<{
        items: OrderItemEntity[];
        id: number;
        orderNo: string;
        userId: number;
        totalAmount: number;
        freightAmount: number;
        discountAmount: number;
        payAmount: number;
        profitPool: number;
        status: string;
        payType: string;
        payTradeNo: string;
        remark: string;
        addressId: number;
        addressSnapshot: any;
        paidAt: Date;
        shippedAt: Date;
        completedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancelOrder(orderId: number, userId: number): Promise<{
        message: string;
    }>;
    confirmOrder(orderId: number, userId: number): Promise<{
        message: string;
    }>;
}
