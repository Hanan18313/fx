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
exports.PromotionConfigEntity = void 0;
const typeorm_1 = require("typeorm");
let PromotionConfigEntity = class PromotionConfigEntity {
};
exports.PromotionConfigEntity = PromotionConfigEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'config_key', length: 50 }),
    __metadata("design:type", String)
], PromotionConfigEntity.prototype, "configKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'config_value', length: 200 }),
    __metadata("design:type", String)
], PromotionConfigEntity.prototype, "configValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], PromotionConfigEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PromotionConfigEntity.prototype, "updatedAt", void 0);
exports.PromotionConfigEntity = PromotionConfigEntity = __decorate([
    (0, typeorm_1.Entity)('promotion_configs')
], PromotionConfigEntity);
//# sourceMappingURL=promotion-config.entity.js.map