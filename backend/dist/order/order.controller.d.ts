import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(req: any, dto: CreateOrderDto): Promise<{
        order_id: number;
        total_amount: number;
        profit_pool: number;
    }>;
    payOrder(id: number, req: any): Promise<{
        message: string;
    }>;
    getOrders(req: any): Promise<{
        data: import("../database/entities/order.entity").OrderEntity[];
    }>;
}
