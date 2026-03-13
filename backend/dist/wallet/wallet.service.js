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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("../database/entities/wallet.entity");
const withdrawal_entity_1 = require("../database/entities/withdrawal.entity");
let WalletService = class WalletService {
    constructor(walletRepo, withdrawalRepo, dataSource) {
        this.walletRepo = walletRepo;
        this.withdrawalRepo = withdrawalRepo;
        this.dataSource = dataSource;
    }
    async getWallet(userId) {
        const wallet = await this.walletRepo.findOne({ where: { userId } });
        return wallet || { balance: 0, frozen: 0, totalEarn: 0 };
    }
    async withdraw(userId, amount) {
        if (!amount || amount <= 0)
            throw new common_1.BadRequestException('提现金额无效');
        return this.dataSource.transaction(async (manager) => {
            const wallet = await manager.findOne(wallet_entity_1.WalletEntity, { where: { userId } });
            if (!wallet || Number(wallet.balance) < amount) {
                throw new common_1.BadRequestException('余额不足');
            }
            await manager.update(wallet_entity_1.WalletEntity, { userId }, {
                balance: () => `balance - ${amount}`,
                frozen: () => `frozen + ${amount}`,
            });
            await manager.save(withdrawal_entity_1.WithdrawalEntity, manager.create(withdrawal_entity_1.WithdrawalEntity, { userId, amount }));
            return { message: '提现申请已提交，预计 1-3 个工作日到账' };
        });
    }
    async getTransactions(userId) {
        const profits = await this.dataSource.query(`SELECT 'profit' AS type, amount, released_at AS date FROM profit_records
       WHERE user_id = ? ORDER BY released_at DESC LIMIT 50`, [userId]);
        const withdrawals = await this.dataSource.query(`SELECT 'withdraw' AS type, amount, applied_at AS date FROM withdrawals
       WHERE user_id = ? ORDER BY applied_at DESC LIMIT 50`, [userId]);
        const data = [...profits, ...withdrawals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { data };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.WalletEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(withdrawal_entity_1.WithdrawalEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], WalletService);
//# sourceMappingURL=wallet.service.js.map