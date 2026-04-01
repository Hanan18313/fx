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
exports.BankCardEntity = void 0;
const typeorm_1 = require("typeorm");
let BankCardEntity = class BankCardEntity {
};
exports.BankCardEntity = BankCardEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], BankCardEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", Number)
], BankCardEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_name', length: 50 }),
    __metadata("design:type", String)
], BankCardEntity.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_no', length: 30 }),
    __metadata("design:type", String)
], BankCardEntity.prototype, "cardNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_four', length: 4 }),
    __metadata("design:type", String)
], BankCardEntity.prototype, "lastFour", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'real_name', length: 50 }),
    __metadata("design:type", String)
], BankCardEntity.prototype, "realName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', default: 0 }),
    __metadata("design:type", Number)
], BankCardEntity.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], BankCardEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BankCardEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BankCardEntity.prototype, "updatedAt", void 0);
exports.BankCardEntity = BankCardEntity = __decorate([
    (0, typeorm_1.Entity)('bank_cards')
], BankCardEntity);
//# sourceMappingURL=bank-card.entity.js.map