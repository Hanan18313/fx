export declare class CreateReviewDto {
    product_id: number;
    order_id: number;
    rating?: number;
    content?: string;
    images?: string[];
    anonymous?: boolean;
}
