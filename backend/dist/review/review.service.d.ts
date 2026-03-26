import { Repository } from 'typeorm';
import { ReviewEntity } from '../database/entities/review.entity';
import { OrderEntity } from '../database/entities/order.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewService {
    private readonly reviewRepo;
    private readonly orderRepo;
    private readonly userRepo;
    constructor(reviewRepo: Repository<ReviewEntity>, orderRepo: Repository<OrderEntity>, userRepo: Repository<UserEntity>);
    create(userId: number, dto: CreateReviewDto): Promise<ReviewEntity>;
    getProductReviews(productId: number, page?: number, limit?: number): Promise<{
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
