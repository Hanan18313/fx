import { OrderMgmtService } from './order-mgmt.service';
export declare class OrderMgmtController {
    private readonly orderMgmtService;
    constructor(orderMgmtService: OrderMgmtService);
    list(page?: number, pageSize?: number, status?: string, userId?: string, startDate?: string, endDate?: string): Promise<{
        list: {
            userPhone: any;
            userNickname: any;
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
        pageSize: number;
    }>;
    detail(id: number): Promise<{
        userPhone: any;
        userNickname: any;
        items: import("../../../database/entities/order-item.entity").OrderItemEntity[];
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
    updateStatus(id: number, status: string): Promise<{
        message: string;
    }>;
}
