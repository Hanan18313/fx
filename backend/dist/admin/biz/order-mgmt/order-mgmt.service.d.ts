import { Repository } from 'typeorm';
import { OrderEntity } from '../../../database/entities/order.entity';
import { OrderItemEntity } from '../../../database/entities/order-item.entity';
export declare class OrderMgmtService {
    private readonly orderRepo;
    private readonly orderItemRepo;
    constructor(orderRepo: Repository<OrderEntity>, orderItemRepo: Repository<OrderItemEntity>);
    list(params: {
        page: number;
        pageSize: number;
        status?: string;
        userId?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        list: {
            userPhone: any;
            userNickname: any;
            id: number;
            userId: number;
            totalAmount: number;
            profitPool: number;
            status: string;
            payType: string;
            payTradeNo: string;
            remark: string;
            paidAt: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    detail(id: number): Promise<{
        items: OrderItemEntity[];
        id: number;
        userId: number;
        totalAmount: number;
        profitPool: number;
        status: string;
        payType: string;
        payTradeNo: string;
        remark: string;
        paidAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: number, newStatus: string): Promise<{
        message: string;
    }>;
}
