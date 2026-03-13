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
exports.WithdrawalMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const withdrawal_entity_1 = require("../../../database/entities/withdrawal.entity");
const wallet_entity_1 = require("../../../database/entities/wallet.entity");
let WithdrawalMgmtService = class WithdrawalMgmtService {
    constructor(withdrawalRepo, walletRepo, dataSource) {
        this.withdrawalRepo = withdrawalRepo;
        this.walletRepo = walletRepo;
        this.dataSource = dataSource;
    }
    async list(params) {
        const { page, pageSize, status, userId } = params;
        const qb = this.withdrawalRepo
            .createQueryBuilder('w')
            .leftJoin('users', 'u', 'u.id = w.user_id')
            .addSelect(['u.phone AS userPhone']);
        if (status) {
            qb.andWhere('w.status = :status', { status });
        }
        if (userId) {
            qb.andWhere('w.user_id = :userId', { userId });
        }
        qb.orderBy('w.applied_at', 'DESC');
        const total = await qb.getCount();
        const raw = await qb
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .getRawAndEntities();
        const list = raw.entities.map((withdrawal, idx) => ({
            ...withdrawal,
            userPhone: raw.raw[idx]?.userPhone ?? null,
        }));
        return { list, total, page, pageSize };
    }
    async approve(id) {
        const withdrawal = await this.withdrawalRepo.findOneBy({ id });
        if (!withdrawal) {
            throw new common_1.BadRequestException('提现记录不存在');
        }
        if (withdrawal.status !== 'pending') {
            throw new common_1.BadRequestException('该提现申请已处理');
        }
        await this.dataSource.transaction(async (manager) => {
            await manager.update(withdrawal_entity_1.WithdrawalEntity, id, {
                status: 'approved',
                processedAt: new Date(),
            });
            await manager
                .createQueryBuilder()
                .update(wallet_entity_1.WalletEntity)
                .set({
                frozen: () => `frozen - ${withdrawal.amount}`,
            })
                .where('user_id = :userId', { userId: withdrawal.userId })
                .execute();
        });
        return { message: '审批通过' };
    }
    async reject(id, rejectReason) {
        if (!rejectReason) {
            throw new common_1.BadRequestException('请填写拒绝原因');
        }
        const withdrawal = await this.withdrawalRepo.findOneBy({ id });
        if (!withdrawal) {
            throw new common_1.BadRequestException('提现记录不存在');
        }
        if (withdrawal.status !== 'pending') {
            throw new common_1.BadRequestException('该提现申请已处理');
        }
        await this.dataSource.transaction(async (manager) => {
            await manager.update(withdrawal_entity_1.WithdrawalEntity, id, {
                status: 'rejected',
                rejectReason,
                processedAt: new Date(),
            });
            await manager
                .createQueryBuilder()
                .update(wallet_entity_1.WalletEntity)
                .set({
                frozen: () => `frozen - ${withdrawal.amount}`,
                balance: () => `balance + ${withdrawal.amount}`,
            })
                .where('user_id = :userId', { userId: withdrawal.userId })
                .execute();
        });
        return { message: '已拒绝' };
    }
};
exports.WithdrawalMgmtService = WithdrawalMgmtService;
exports.WithdrawalMgmtService = WithdrawalMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(withdrawal_entity_1.WithdrawalEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_entity_1.WalletEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], WithdrawalMgmtService);
//# sourceMappingURL=withdrawal-mgmt.service.js.map