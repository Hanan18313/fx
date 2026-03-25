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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const promotion_config_service_1 = require("../../../promotion/promotion-config.service");
let PromotionMgmtService = class PromotionMgmtService {
    constructor(dataSource, configService) {
        this.dataSource = dataSource;
        this.configService = configService;
    }
    async getOverview() {
        const [totals] = await this.dataSource.query(`
      SELECT
        COUNT(DISTINCT CASE WHEN type='referral' THEN from_user_id END) AS total_invites,
        COALESCE(SUM(CASE WHEN type='referral' THEN amount ELSE 0 END), 0) AS total_referral_amount,
        COALESCE(SUM(CASE WHEN type='commission' THEN amount ELSE 0 END), 0) AS total_commission_amount
      FROM promotion_rewards
    `);
        const [today] = await this.dataSource.query(`
      SELECT
        COUNT(DISTINCT CASE WHEN type='referral' THEN from_user_id END) AS today_invites,
        COALESCE(SUM(CASE WHEN type='referral' THEN amount ELSE 0 END), 0) AS today_referral_amount,
        COALESCE(SUM(CASE WHEN type='commission' THEN amount ELSE 0 END), 0) AS today_commission_amount
      FROM promotion_rewards
      WHERE DATE(created_at) = CURDATE()
    `);
        return {
            total_invites: Number(totals.total_invites),
            total_referral_amount: Number(totals.total_referral_amount),
            total_commission_amount: Number(totals.total_commission_amount),
            today_invites: Number(today.today_invites),
            today_referral_amount: Number(today.today_referral_amount),
            today_commission_amount: Number(today.today_commission_amount),
        };
    }
    async getRewards(page = 1, limit = 20, type, startDate, endDate) {
        let where = 'WHERE 1=1';
        const params = [];
        if (type) {
            where += ' AND pr.type = ?';
            params.push(type);
        }
        if (startDate) {
            where += ' AND DATE(pr.created_at) >= ?';
            params.push(startDate);
        }
        if (endDate) {
            where += ' AND DATE(pr.created_at) <= ?';
            params.push(endDate);
        }
        const offset = (page - 1) * limit;
        const data = await this.dataSource.query(`SELECT pr.id, u.nickname AS user_name, fu.nickname AS from_user_name,
              pr.type, pr.amount, pr.order_id, pr.created_at
       FROM promotion_rewards pr
       LEFT JOIN users u ON u.id = pr.user_id
       LEFT JOIN users fu ON fu.id = pr.from_user_id
       ${where}
       ORDER BY pr.created_at DESC
       LIMIT ? OFFSET ?`, [...params, limit, offset]);
        const [{ cnt }] = await this.dataSource.query(`SELECT COUNT(*) AS cnt FROM promotion_rewards pr ${where}`, params);
        return { data, total: Number(cnt), page };
    }
    async getConfig() {
        return this.configService.getAllConfigs();
    }
    async updateConfig(dto) {
        if (dto.referral_reward_amount !== undefined) {
            await this.configService.setConfig('referral_reward_amount', String(dto.referral_reward_amount));
        }
        if (dto.commission_rate !== undefined) {
            await this.configService.setConfig('commission_rate', String(dto.commission_rate));
        }
        if (dto.referral_reward_enabled !== undefined) {
            await this.configService.setConfig('referral_reward_enabled', String(dto.referral_reward_enabled));
        }
        if (dto.commission_enabled !== undefined) {
            await this.configService.setConfig('commission_enabled', String(dto.commission_enabled));
        }
        return this.configService.getAllConfigs();
    }
};
exports.PromotionMgmtService = PromotionMgmtService;
exports.PromotionMgmtService = PromotionMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        promotion_config_service_1.PromotionConfigService])
], PromotionMgmtService);
//# sourceMappingURL=promotion-mgmt.service.js.map