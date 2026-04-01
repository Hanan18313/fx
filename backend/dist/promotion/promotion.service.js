"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PromotionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promotion_reward_entity_1 = require("../database/entities/promotion-reward.entity");
const user_entity_1 = require("../database/entities/user.entity");
const promotion_config_service_1 = require("./promotion-config.service");
let PromotionService = PromotionService_1 = class PromotionService {
    constructor(rewardRepo, userRepo, dataSource, configService) {
        this.rewardRepo = rewardRepo;
        this.userRepo = userRepo;
        this.dataSource = dataSource;
        this.configService = configService;
        this.logger = new common_1.Logger(PromotionService_1.name);
    }
    async grantReferralReward(parentId, fromUserId) {
        const enabled = await this.configService.getBoolConfig('referral_reward_enabled', true);
        if (!enabled)
            return;
        const parent = await this.userRepo.findOne({ where: { id: parentId } });
        if (!parent || parent.status !== 1)
            return;
        const existing = await this.rewardRepo.findOne({
            where: { userId: parentId, fromUserId, type: 'referral' },
        });
        if (existing)
            return;
        const amount = await this.configService.getNumberConfig('referral_reward_amount', 5);
        await this.dataSource.transaction(async (manager) => {
            await manager.save(promotion_reward_entity_1.PromotionRewardEntity, manager.create(promotion_reward_entity_1.PromotionRewardEntity, {
                userId: parentId,
                fromUserId,
                type: 'referral',
                amount,
            }));
            await manager.query(`UPDATE wallets SET balance = balance + ?, total_earn = total_earn + ? WHERE user_id = ?`, [amount, amount, parentId]);
        });
        this.logger.log(`邀请奖励发放: 推荐人=${parentId}, 新用户=${fromUserId}, 金额=${amount}`);
    }
    async grantCommission(parentId, fromUserId, orderId, profitPool, manager) {
        const enabled = await this.configService.getBoolConfig('commission_enabled', true);
        if (!enabled)
            return;
        const parent = await this.userRepo.findOne({ where: { id: parentId } });
        if (!parent || parent.status !== 1)
            return;
        const existing = await this.rewardRepo.findOne({
            where: { userId: parentId, fromUserId, type: 'commission', orderId },
        });
        if (existing)
            return;
        const rate = await this.configService.getNumberConfig('commission_rate', 0.05);
        const amount = +(profitPool * rate).toFixed(4);
        if (amount <= 0)
            return;
        const em = manager || this.dataSource.manager;
        await em.save(promotion_reward_entity_1.PromotionRewardEntity, em.create(promotion_reward_entity_1.PromotionRewardEntity, {
            userId: parentId,
            fromUserId,
            orderId,
            type: 'commission',
            amount,
        }));
        await em.query(`UPDATE wallets SET balance = balance + ?, total_earn = total_earn + ? WHERE user_id = ?`, [amount, amount, parentId]);
        this.logger.log(`佣金发放: 推荐人=${parentId}, 订单=${orderId}, 金额=${amount}`);
    }
    async getStats(userId) {
        const inviteCount = await this.userRepo.count({ where: { parentId: userId } });
        const [result] = await this.dataSource.query(`SELECT
         COALESCE(SUM(CASE WHEN type='referral' THEN amount ELSE 0 END), 0) AS referral_total,
         COALESCE(SUM(CASE WHEN type='commission' THEN amount ELSE 0 END), 0) AS commission_total,
         COALESCE(SUM(amount), 0) AS total_reward
       FROM promotion_rewards WHERE user_id = ?`, [userId]);
        const [monthlyRow] = await this.dataSource.query(`SELECT COALESCE(SUM(amount), 0) AS monthly_estimate
       FROM promotion_rewards
       WHERE user_id = ? AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')`, [userId]);
        const [yesterdayRow] = await this.dataSource.query(`SELECT COALESCE(SUM(amount), 0) AS yesterday_earning
       FROM profit_records
       WHERE user_id = ? AND released_at = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`, [userId]);
        return {
            invite_count: inviteCount,
            referral_total: Number(result.referral_total),
            commission_total: Number(result.commission_total),
            total_reward: Number(result.total_reward),
            monthly_estimate: Number(monthlyRow.monthly_estimate),
            yesterday_earning: Number(yesterdayRow.yesterday_earning),
        };
    }
    async getInvitees(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const data = await this.dataSource.query(`SELECT u.nickname, u.avatar, u.created_at AS createdAt,
              COALESCE(
                (SELECT SUM(amount) FROM profit_records WHERE user_id = u.id AND released_at = CURDATE()),
                0
              ) AS todayEarning,
              1 AS level
       FROM users u
       WHERE u.parent_id = ?
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`, [userId, limit, offset]);
        const [{ cnt }] = await this.dataSource.query(`SELECT COUNT(*) AS cnt FROM users WHERE parent_id = ?`, [userId]);
        return { data: data.map(row => ({ ...row, todayEarning: Number(row.todayEarning), level: 1 })), total: Number(cnt), page };
    }
    async getRewards(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const data = await this.dataSource.query(`SELECT pr.type, pr.amount, pr.created_at,
              u.nickname AS from_nickname
       FROM promotion_rewards pr
       LEFT JOIN users u ON u.id = pr.from_user_id
       WHERE pr.user_id = ?
       ORDER BY pr.created_at DESC
       LIMIT ? OFFSET ?`, [userId, limit, offset]);
        const [{ cnt }] = await this.dataSource.query(`SELECT COUNT(*) AS cnt FROM promotion_rewards WHERE user_id = ?`, [userId]);
        return { data, total: Number(cnt), page };
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = PromotionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(promotion_reward_entity_1.PromotionRewardEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        promotion_config_service_1.PromotionConfigService])
], PromotionService);
//# sourceMappingURL=promotion.service.js.map