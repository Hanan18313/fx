import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(req: any, dto: CreateOrderDto): Promise<{
        id: number;
        payAmount: number;
        totalAmount: number;
    }>;
    payOrder(id: number, req: any): Promise<{
        payAmount: number;
        totalAmount: number;
    }>;
    getOrders(req: any, status?: string, page?: string, limit?: string): Promise<{
        data: {
            items: import("../database/entities/order-item.entity").OrderItemEntity[];
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
    getOrderDetail(id: number, req: any): Promise<{
        items: import("../database/entities/order-item.entity").OrderItemEntity[];
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
    cancelOrder(id: number, req: any): Promise<{
        message: string;
    }>;
    confirmOrder(id: number, req: any): Promise<{
        message: string;
    }>;
}
