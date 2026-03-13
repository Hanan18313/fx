"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const admin_auth_controller_1 = require("./admin-auth.controller");
const admin_auth_service_1 = require("./admin-auth.service");
const admin_jwt_strategy_1 = require("./admin-jwt.strategy");
const sys_admin_entity_1 = require("../../database/entities/sys-admin.entity");
const sys_admin_role_entity_1 = require("../../database/entities/sys-admin-role.entity");
const sys_login_log_entity_1 = require("../../database/entities/sys-login-log.entity");
const token_blacklist_service_1 = require("../../common/services/token-blacklist.service");
let AdminAuthModule = class AdminAuthModule {
};
exports.AdminAuthModule = AdminAuthModule;
exports.AdminAuthModule = AdminAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sys_admin_entity_1.SysAdminEntity, sys_admin_role_entity_1.SysAdminRoleEntity, sys_login_log_entity_1.SysLoginLogEntity]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET', 'secret'),
                    signOptions: { expiresIn: '7d' },
                }),
            }),
        ],
        controllers: [admin_auth_controller_1.AdminAuthController],
        providers: [admin_auth_service_1.AdminAuthService, admin_jwt_strategy_1.AdminJwtStrategy, token_blacklist_service_1.TokenBlacklistService],
        exports: [jwt_1.JwtModule, admin_jwt_strategy_1.AdminJwtStrategy],
    })
], AdminAuthModule);
//# sourceMappingURL=admin-auth.module.js.map