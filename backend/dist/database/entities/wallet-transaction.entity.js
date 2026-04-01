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
exports.WalletTransactionEntity = void 0;
const typeorm_1 = require("typeorm");
let WalletTransactionEntity = class WalletTransactionEntity {
};
exports.WalletTransactionEntity = WalletTransactionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], WalletTransactionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WalletTransactionEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['income', 'expense'] }),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], WalletTransactionEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ref_type', length: 30, nullable: true }),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "refType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ref_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], WalletTransactionEntity.prototype, "refId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_after', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], WalletTransactionEntity.prototype, "balanceAfter", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WalletTransactionEntity.prototype, "createdAt", void 0);
exports.WalletTransactionEntity = WalletTransactionEntity = __decorate([
    (0, typeorm_1.Entity)('wallet_transactions')
], WalletTransactionEntity);
//# sourceMappingURL=wallet-transaction.entity.js.map