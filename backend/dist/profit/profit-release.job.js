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
var ProfitReleaseJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitReleaseJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("typeorm");
const profit_engine_service_1 = require("./profit-engine.service");
let ProfitReleaseJob = ProfitReleaseJob_1 = class ProfitReleaseJob {
    constructor(dataSource, engine) {
        this.dataSource = dataSource;
        this.engine = engine;
        this.logger = new common_1.Logger(ProfitReleaseJob_1.name);
    }
    async handleProfitRelease() {
        this.logger.log('开始执行分润释放任务...');
        const today = new Date().toISOString().split('T')[0];
        const orders = await this.dataSource.query(`
      SELECT id, user_id, profit_pool,
             DATEDIFF(CURDATE(), DATE(paid_at)) AS days_passed
      FROM orders
      WHERE status = 'done'
        AND DATEDIFF(CURDATE(), DATE(paid_at)) BETWEEN 1 AND 30
    `);
        let processed = 0;
        for (const order of orders) {
            const t = order.days_passed;
            const amount = this.engine.calcPersonalRelease(Number(order.profit_pool), t);
            const [existing] = await this.dataSource.query(`SELECT id FROM profit_records WHERE order_id = ? AND day_index = ? AND type = 'personal'`, [order.id, t]);
            if (existing)
                continue;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`INSERT INTO profit_records (user_id, order_id, type, day_index, amount, released_at)
           VALUES (?, ?, 'personal', ?, ?, ?)`, [order.user_id, order.id, t, amount.toFixed(4), today]);
                await manager.query(`UPDATE wallets SET balance = balance + ?, total_earn = total_earn + ? WHERE user_id = ?`, [amount, amount, order.user_id]);
            });
            processed++;
        }
        this.logger.log(`分润释放完成，处理订单数: ${processed}`);
    }
};
exports.ProfitReleaseJob = ProfitReleaseJob;
__decorate([
    (0, schedule_1.Cron)('5 0 * * *', { timeZone: 'Asia/Shanghai' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProfitReleaseJob.prototype, "handleProfitRelease", null);
exports.ProfitReleaseJob = ProfitReleaseJob = ProfitReleaseJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        profit_engine_service_1.ProfitEngineService])
], ProfitReleaseJob);
//# sourceMappingURL=profit-release.job.js.map