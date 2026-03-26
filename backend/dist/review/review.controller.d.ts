import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(req: any, dto: CreateReviewDto): Promise<import("../database/entities/review.entity").ReviewEntity>;
    getProductReviews(productId: number, page?: string, limit?: string): Promise<{
        data: {
            id: number;
            rating: number;
            content: string;
            images: string[];
            nickname: string;
            avatar: any;
            created_at: Date;
        }[];
        total: number;
        page: number;
    }>;
}
