import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(req: any, dto: CreateReviewDto): Promise<{}>;
    getStats(productId?: string): Promise<{
        avgRating: number;
        total: number;
        withImage: number;
        positive: number;
        withFollowup: number;
    }>;
    getReviews(page?: string, limit?: string, productId?: string, hasImage?: string, minRating?: string, hasFollowup?: string): Promise<{
        data: {
            id: number;
            rating: number;
            content: string;
            images: string[];
            nickname: string;
            avatar: any;
            hasFollowup: number;
            followupContent: string;
            followupAt: Date;
            createdAt: Date;
        }[];
        total: number;
    }>;
}
