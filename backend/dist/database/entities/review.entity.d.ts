export declare class ReviewEntity {
    id: number;
    userId: number;
    productId: number;
    orderId: number;
    rating: number;
    content: string;
    images: string[];
    isAnonymous: number;
    hasFollowup: number;
    followupContent: string;
    followupImages: string[];
    followupAt: Date;
    createdAt: Date;
}
