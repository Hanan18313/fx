export declare class OrderItemDto {
    product_id: number;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    address_id?: number;
    remark?: string;
}
