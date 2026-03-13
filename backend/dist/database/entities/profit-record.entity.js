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
exports.ProfitRecordEntity = void 0;
const typeorm_1 = require("typeorm");
let ProfitRecordEntity = class ProfitRecordEntity {
};
exports.ProfitRecordEntity = ProfitRecordEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ProfitRecordEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ProfitRecordEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ProfitRecordEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['personal', 'team'] }),
    __metadata("design:type", String)
], ProfitRecordEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'day_index', type: 'tinyint' }),
    __metadata("design:type", Number)
], ProfitRecordEntity.prototype, "dayIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], ProfitRecordEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'released_at', type: 'date' }),
    __metadata("design:type", String)
], ProfitRecordEntity.prototype, "releasedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProfitRecordEntity.prototype, "createdAt", void 0);
exports.ProfitRecordEntity = ProfitRecordEntity = __decorate([
    (0, typeorm_1.Entity)('profit_records'),
    (0, typeorm_1.Unique)(['orderId', 'dayIndex', 'type'])
], ProfitRecordEntity);
//# sourceMappingURL=profit-record.entity.js.map