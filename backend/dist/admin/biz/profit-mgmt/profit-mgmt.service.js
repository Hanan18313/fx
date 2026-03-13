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
exports.ProfitMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let ProfitMgmtService = class ProfitMgmtService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getStats() {
        const [totalResult] = await this.dataSource.query(`SELECT COALESCE(SUM(amount), 0) AS totalProfit FROM profit_records`);
        const [todayResult] = await this.dataSource.query(`SELECT COALESCE(SUM(amount), 0) AS todayProfit
       FROM profit_records
       WHERE DATE(released_at) = CURDATE()`);
        const typeResults = await this.dataSource.query(`SELECT type, COALESCE(SUM(amount), 0) AS totalAmount
       FROM profit_records
       GROUP BY type`);
        const profitByType = { personal: 0, team: 0 };
        for (const row of typeResults) {
            profitByType[row.type] = parseFloat(row.totalAmount);
        }
        const topEarners = await this.dataSource.query(`SELECT pr.user_id AS userId,
              u.phone,
              u.nickname,
              COALESCE(SUM(pr.amount), 0) AS totalEarned
       FROM profit_records pr
       LEFT JOIN users u ON u.id = pr.user_id
       GROUP BY pr.user_id, u.phone, u.nickname
       ORDER BY totalEarned DESC
       LIMIT 10`);
        return {
            totalProfit: parseFloat(totalResult.totalProfit),
            todayProfit: parseFloat(todayResult.todayProfit),
            personalProfit: profitByType.personal,
            teamProfit: profitByType.team,
            topEarners: topEarners.map((row) => ({
                userId: row.userId,
                phone: row.phone,
                nickname: row.nickname,
                totalEarned: parseFloat(row.totalEarned),
            })),
        };
    }
};
exports.ProfitMgmtService = ProfitMgmtService;
exports.ProfitMgmtService = ProfitMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProfitMgmtService);
//# sourceMappingURL=profit-mgmt.service.js.map