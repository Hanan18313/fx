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
exports.SysLoginLogEntity = void 0;
const typeorm_1 = require("typeorm");
let SysLoginLogEntity = class SysLoginLogEntity {
};
exports.SysLoginLogEntity = SysLoginLogEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], SysLoginLogEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], SysLoginLogEntity.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], SysLoginLogEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], SysLoginLogEntity.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', length: 500, nullable: true }),
    __metadata("design:type", String)
], SysLoginLogEntity.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SysLoginLogEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], SysLoginLogEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SysLoginLogEntity.prototype, "createdAt", void 0);
exports.SysLoginLogEntity = SysLoginLogEntity = __decorate([
    (0, typeorm_1.Entity)('sys_login_log')
], SysLoginLogEntity);
//# sourceMappingURL=sys-login-log.entity.js.map