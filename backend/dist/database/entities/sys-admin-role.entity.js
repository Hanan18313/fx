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
exports.SysAdminRoleEntity = void 0;
const typeorm_1 = require("typeorm");
let SysAdminRoleEntity = class SysAdminRoleEntity {
};
exports.SysAdminRoleEntity = SysAdminRoleEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'admin_id', type: 'bigint' }),
    __metadata("design:type", Number)
], SysAdminRoleEntity.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'role_id', type: 'bigint' }),
    __metadata("design:type", Number)
], SysAdminRoleEntity.prototype, "roleId", void 0);
exports.SysAdminRoleEntity = SysAdminRoleEntity = __decorate([
    (0, typeorm_1.Entity)('sys_admin_role')
], SysAdminRoleEntity);
//# sourceMappingURL=sys-admin-role.entity.js.map