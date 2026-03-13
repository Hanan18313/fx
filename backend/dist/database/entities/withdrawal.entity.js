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
exports.WithdrawalEntity = void 0;
const typeorm_1 = require("typeorm");
let WithdrawalEntity = class WithdrawalEntity {
};
exports.WithdrawalEntity = WithdrawalEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], WithdrawalEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WithdrawalEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], WithdrawalEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_name', length: 50, nullable: true }),
    __metadata("design:type", String)
], WithdrawalEntity.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_account', length: 50, nullable: true }),
    __metadata("design:type", String)
], WithdrawalEntity.prototype, "bankAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'real_name', length: 50, nullable: true }),
    __metadata("design:type", String)
], WithdrawalEntity.prototype, "realName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' }),
    __metadata("design:type", String)
], WithdrawalEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reject_reason', length: 200, nullable: true }),
    __metadata("design:type", String)
], WithdrawalEntity.prototype, "rejectReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'applied_at' }),
    __metadata("design:type", Date)
], WithdrawalEntity.prototype, "appliedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WithdrawalEntity.prototype, "processedAt", void 0);
exports.WithdrawalEntity = WithdrawalEntity = __decorate([
    (0, typeorm_1.Entity)('withdrawals')
], WithdrawalEntity);
//# sourceMappingURL=withdrawal.entity.js.map