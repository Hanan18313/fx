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
const bank_card_entity_1 = require("../database/entities/bank-card.entity");
const wallet_transaction_entity_1 = require("../database/entities/wallet-transaction.entity");
let WalletService = class WalletService {
    constructor(walletRepo, withdrawalRepo, bankCardRepo, transactionRepo, dataSource) {
        this.walletRepo = walletRepo;
        this.withdrawalRepo = withdrawalRepo;
        this.bankCardRepo = bankCardRepo;
        this.transactionRepo = transactionRepo;
        this.dataSource = dataSource;
    }
    async getWallet(userId) {
        const wallet = await this.walletRepo.findOne({ where: { userId } });
        return wallet || { balance: 0, frozen: 0, totalEarn: 0 };
    }
    async withdraw(userId, amount, method) {
        if (!amount || amount <= 0)
            throw new common_1.BadRequestException('提现金额无效');
        if (amount < 10)
            throw new common_1.BadRequestException('最低提现金额为 10 元');
        const withdrawMethod = method === 'alipay' ? 'alipay' : 'bank';
        let bankCard = null;
        if (withdrawMethod === 'bank') {
            bankCard = await this.bankCardRepo.findOne({
                where: { userId, isDefault: 1, status: 1 },
            });
        }
        return this.dataSource.transaction(async (manager) => {
            const wallet = await manager.findOne(wallet_entity_1.WalletEntity, { where: { userId } });
            if (!wallet || Number(wallet.balance) < amount) {
                throw new common_1.BadRequestException('余额不足');
            }
            const newBalance = Number(wallet.balance) - amount;
            await manager.update(wallet_entity_1.WalletEntity, { userId }, {
                balance: () => `balance - ${amount}`,
                frozen: () => `frozen + ${amount}`,
            });
            const withdrawal = await manager.save(withdrawal_entity_1.WithdrawalEntity, manager.create(withdrawal_entity_1.WithdrawalEntity, {
                userId,
                amount,
                method: withdrawMethod,
                bankCardId: bankCard?.id ?? null,
                bankName: bankCard?.bankName ?? null,
                bankAccount: bankCard?.cardNo ?? null,
                realName: bankCard?.realName ?? null,
            }));
            await manager.save(wallet_transaction_entity_1.WalletTransactionEntity, manager.create(wallet_transaction_entity_1.WalletTransactionEntity, {
                userId,
                type: 'expense',
                amount,
                name: '申请提现',
                refType: 'withdrawal',
                refId: withdrawal.id,
                balanceAfter: newBalance,
            }));
            return { message: '提现申请已提交，预计 1-3 个工作日到账' };
        });
    }
    async getBankCards(userId) {
        const data = await this.bankCardRepo.find({
            where: { userId, status: 1 },
            select: ['id', 'bankName', 'lastFour', 'realName', 'isDefault'],
            order: { isDefault: 'DESC', createdAt: 'ASC' },
        });
        return { data };
    }
    async getDefaultBankCard(userId) {
        const card = await this.bankCardRepo.findOne({
            where: { userId, isDefault: 1, status: 1 },
            select: ['bankName', 'lastFour'],
        });
        return card ?? null;
    }
    async getTransactions(userId, page = 1, limit = 20) {
        const [data, total] = await this.transactionRepo.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            select: ['id', 'type', 'amount', 'name', 'createdAt'],
        });
        return { data, total };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.WalletEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(withdrawal_entity_1.WithdrawalEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(bank_card_entity_1.BankCardEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(wallet_transaction_entity_1.WalletTransactionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], WalletService);
//# sourceMappingURL=wallet.service.js.map