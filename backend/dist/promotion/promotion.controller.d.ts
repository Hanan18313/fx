import { PromotionService } from './promotion.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
export declare class PromotionController {
    private readonly promotionService;
    private readonly userRepo;
    constructor(promotionService: PromotionService, userRepo: Repository<UserEntity>);
    getStats(req: any): Promise<{
        invite_count: number;
        referral_total: number;
        commission_total: number;
        total_reward: number;
        monthly_estimate: number;
        yesterday_earning: number;
    }>;
    getInvitees(req: any, page?: string, limit?: string): Promise<{
        data: any;
        total: number;
        page: number;
    }>;
    getRewards(req: any, page?: string, limit?: string): Promise<{
        data: any;
        total: number;
        page: number;
    }>;
    getInviteCode(req: any): Promise<{
        invite_code: string;
    }>;
}
