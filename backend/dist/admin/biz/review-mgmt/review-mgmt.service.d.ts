import { Repository } from 'typeorm';
import { ReviewEntity } from '../../../database/entities/review.entity';
export declare class ReviewMgmtService {
    private readonly reviewRepo;
    constructor(reviewRepo: Repository<ReviewEntity>);
    list(params: {
        page: number;
        pageSize: number;
        productId?: number;
        rating?: number;
    }): Promise<{
        list: {
            userNickname: any;
            userPhone: any;
            productName: any;
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
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
