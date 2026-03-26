export declare class ReviewEntity {
    id: number;
    userId: number;
    productId: number;
    orderId: number;
    rating: number;
    content: string;
    images: string[];
    isAnonymous: number;
    createdAt: Date;
}
