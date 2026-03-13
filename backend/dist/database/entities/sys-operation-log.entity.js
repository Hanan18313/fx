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
exports.SysOperationLogEntity = void 0;
const typeorm_1 = require("typeorm");
let SysOperationLogEntity = class SysOperationLogEntity {
};
exports.SysOperationLogEntity = SysOperationLogEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], SysOperationLogEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], SysOperationLogEntity.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_name', length: 50, nullable: true }),
    __metadata("design:type", String)
], SysOperationLogEntity.prototype, "adminName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], SysOperationLogEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], SysOperationLogEntity.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], SysOperationLogEntity.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], SysOperationLogEntity.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_body', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SysOperationLogEntity.prototype, "requestBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_code', nullable: true }),
    __metadata("design:type", Number)
], SysOperationLogEntity.prototype, "responseCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], SysOperationLogEntity.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', length: 500, nullable: true }),
    __metadata("design:type", String)
], SysOperationLogEntity.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_ms', nullable: true }),
    __metadata("design:type", Number)
], SysOperationLogEntity.prototype, "durationMs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], SysOperationLogEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_msg', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SysOperationLogEntity.prototype, "errorMsg", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SysOperationLogEntity.prototype, "createdAt", void 0);
exports.SysOperationLogEntity = SysOperationLogEntity = __decorate([
    (0, typeorm_1.Entity)('sys_operation_log')
], SysOperationLogEntity);
//# sourceMappingURL=sys-operation-log.entity.js.map