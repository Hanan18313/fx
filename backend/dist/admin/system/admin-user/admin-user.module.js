"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sys_admin_entity_1 = require("../../../database/entities/sys-admin.entity");
const sys_admin_role_entity_1 = require("../../../database/entities/sys-admin-role.entity");
const admin_user_controller_1 = require("./admin-user.controller");
const admin_user_service_1 = require("./admin-user.service");
let AdminUserModule = class AdminUserModule {
};
exports.AdminUserModule = AdminUserModule;
exports.AdminUserModule = AdminUserModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sys_admin_entity_1.SysAdminEntity, sys_admin_role_entity_1.SysAdminRoleEntity])],
        controllers: [admin_user_controller_1.AdminUserController],
        providers: [admin_user_service_1.AdminUserService],
        exports: [admin_user_service_1.AdminUserService],
    })
], AdminUserModule);
//# sourceMappingURL=admin-user.module.js.map