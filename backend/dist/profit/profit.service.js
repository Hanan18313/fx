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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const profit_record_entity_1 = require("../database/entities/profit-record.entity");
let ProfitService = class ProfitService {
    constructor(recordRepo, dataSource) {
        this.recordRepo = recordRepo;
        this.dataSource = dataSource;
    }
    async getDashboard(userId) {
        const [releasedRow] = await this.dataSource.query(`SELECT COALESCE(SUM(amount), 0) AS total FROM profit_records WHERE user_id = ? AND type = 'personal'`, [userId]);
        const [todayRow] = await this.dataSource.query(`SELECT COALESCE(SUM(amount), 0) AS amount FROM profit_records
       WHERE user_id = ? AND type = 'personal' AND released_at = CURDATE()`, [userId]);
        const [pendingRow] = await this.dataSource.query(`SELECT COALESCE(SUM(profit_pool), 0) AS total FROM orders
       WHERE user_id = ? AND status = 'done' AND DATEDIFF(CURDATE(), DATE(paid_at)) < 30`, [userId]);
        return {
            released_total: releasedRow.total,
            today_amount: todayRow.amount,
            pending_total: pendingRow.total,
        };
    }
    async getRecords(userId) {
        const data = await this.recordRepo.find({
            where: { userId },
            order: { releasedAt: 'DESC' },
            take: 100,
        });
        return { data };
    }
    async getTeamProfit(userId) {
        const [row] = await this.dataSource.query(`SELECT COALESCE(SUM(amount), 0) AS total FROM profit_records WHERE user_id = ? AND type = 'team'`, [userId]);
        return { team_profit_total: row.total };
    }
};
exports.ProfitService = ProfitService;
exports.ProfitService = ProfitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profit_record_entity_1.ProfitRecordEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_3.DataSource])
], ProfitService);
//# sourceMappingURL=profit.service.js.map