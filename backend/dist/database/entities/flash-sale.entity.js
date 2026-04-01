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
exports.FlashSaleEntity = void 0;
const typeorm_1 = require("typeorm");
let FlashSaleEntity = class FlashSaleEntity {
};
exports.FlashSaleEntity = FlashSaleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], FlashSaleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'bigint' }),
    __metadata("design:type", Number)
], FlashSaleEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flash_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FlashSaleEntity.prototype, "flashPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_limit', nullable: true }),
    __metadata("design:type", Number)
], FlashSaleEntity.prototype, "stockLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], FlashSaleEntity.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], FlashSaleEntity.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], FlashSaleEntity.prototype, "sort", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], FlashSaleEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FlashSaleEntity.prototype, "createdAt", void 0);
exports.FlashSaleEntity = FlashSaleEntity = __decorate([
    (0, typeorm_1.Entity)('flash_sales')
], FlashSaleEntity);
//# sourceMappingURL=flash-sale.entity.js.map