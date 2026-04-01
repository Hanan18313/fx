import { ReviewMgmtService } from './review-mgmt.service';
export declare class ReviewMgmtController {
    private readonly reviewMgmtService;
    constructor(reviewMgmtService: ReviewMgmtService);
    list(page?: number, pageSize?: number, productId?: string, rating?: string): Promise<{
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
