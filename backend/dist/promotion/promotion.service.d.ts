import { Repository, DataSource } from 'typeorm';
import { PromotionRewardEntity } from '../database/entities/promotion-reward.entity';
import { UserEntity } from '../database/entities/user.entity';
import { PromotionConfigService } from './promotion-config.service';
export declare class PromotionService {
    private readonly rewardRepo;
    private readonly userRepo;
    private readonly dataSource;
    private readonly configService;
    private readonly logger;
    constructor(rewardRepo: Repository<PromotionRewardEntity>, userRepo: Repository<UserEntity>, dataSource: DataSource, configService: PromotionConfigService);
    grantReferralReward(parentId: number, fromUserId: number): Promise<void>;
    grantCommission(parentId: number, fromUserId: number, orderId: number, profitPool: number, manager?: import('typeorm').EntityManager): Promise<void>;
    getStats(userId: number): Promise<{
        invite_count: number;
        referral_total: number;
        commission_total: number;
        total_reward: number;
    }>;
    getInvitees(userId: number, page?: number, limit?: number): Promise<{
        data: UserEntity[];
        total: number;
        page: number;
    }>;
    getRewards(userId: number, page?: number, limit?: number): Promise<{
        data: any;
        total: number;
        page: number;
    }>;
}
