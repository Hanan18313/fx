import { PromotionMgmtService } from './promotion-mgmt.service';
import { UpdatePromotionConfigDto } from './dto/update-promotion-config.dto';
export declare class PromotionMgmtController {
    private readonly promotionMgmtService;
    constructor(promotionMgmtService: PromotionMgmtService);
    getOverview(): Promise<{
        total_invites: number;
        total_referral_amount: number;
        total_commission_amount: number;
        today_invites: number;
        today_referral_amount: number;
        today_commission_amount: number;
    }>;
    getRewards(page?: string, limit?: string, type?: string, startDate?: string, endDate?: string): Promise<{
        data: any;
        total: number;
        page: number;
    }>;
    getConfig(): Promise<Record<string, string>>;
    updateConfig(dto: UpdatePromotionConfigDto): Promise<Record<string, string>>;
}
