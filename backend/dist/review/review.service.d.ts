import { Repository, DataSource } from 'typeorm';
import { ReviewEntity } from '../database/entities/review.entity';
import { OrderEntity } from '../database/entities/order.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewService {
    private readonly reviewRepo;
    private readonly orderRepo;
    private readonly userRepo;
    private readonly dataSource;
    constructor(reviewRepo: Repository<ReviewEntity>, orderRepo: Repository<OrderEntity>, userRepo: Repository<UserEntity>, dataSource: DataSource);
    create(userId: number, dto: CreateReviewDto): Promise<{}>;
    getStats(productId?: number): Promise<{
        avgRating: number;
        total: number;
        withImage: number;
        positive: number;
        withFollowup: number;
    }>;
    getReviews(params: {
        page: number;
        limit: number;
        productId?: number;
        hasImage?: boolean;
        minRating?: number;
        hasFollowup?: boolean;
    }): Promise<{
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
