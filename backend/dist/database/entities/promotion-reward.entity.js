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
exports.PromotionRewardEntity = void 0;
const typeorm_1 = require("typeorm");
let PromotionRewardEntity = class PromotionRewardEntity {
};
exports.PromotionRewardEntity = PromotionRewardEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], PromotionRewardEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", Number)
], PromotionRewardEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_user_id', type: 'bigint' }),
    __metadata("design:type", Number)
], PromotionRewardEntity.prototype, "fromUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], PromotionRewardEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['referral', 'commission'] }),
    __metadata("design:type", String)
], PromotionRewardEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], PromotionRewardEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PromotionRewardEntity.prototype, "createdAt", void 0);
exports.PromotionRewardEntity = PromotionRewardEntity = __decorate([
    (0, typeorm_1.Entity)('promotion_rewards'),
    (0, typeorm_1.Index)('uk_reward_unique', ['userId', 'fromUserId', 'type', 'orderId'], { unique: true })
], PromotionRewardEntity);
//# sourceMappingURL=promotion-reward.entity.js.map