import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(req: any, dto: CreateOrderDto): Promise<{
        order_id: number;
        order_no: string;
        total_amount: number;
        pay_amount: number;
        profit_pool: number;
    }>;
    payOrder(id: number, req: any): Promise<{
        message: string;
    }>;
    getOrders(req: any, status?: string, page?: string, limit?: string): Promise<{
        data: import("../database/entities/order.entity").OrderEntity[];
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
