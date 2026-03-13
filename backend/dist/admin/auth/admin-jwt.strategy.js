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
exports.AdminJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const token_blacklist_service_1 = require("../../common/services/token-blacklist.service");
let AdminJwtStrategy = class AdminJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'admin-jwt') {
    constructor(config, dataSource, tokenBlacklistService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET', 'secret'),
            passReqToCallback: true,
        });
        this.dataSource = dataSource;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async validate(req, payload) {
        if (payload.type !== 'admin') {
            return null;
        }
        const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (token && await this.tokenBlacklistService.isBlacklisted(token)) {
            return null;
        }
        const rows = await this.dataSource.query(`SELECT a.id, a.username, a.dept_id AS deptId, r.code AS roleCode
       FROM sys_admin a
       LEFT JOIN sys_admin_role ar ON ar.admin_id = a.id
       LEFT JOIN sys_role r ON r.id = ar.role_id AND r.status = 1
       WHERE a.id = ? AND a.status = 1 AND a.deleted_at IS NULL`, [payload.id]);
        if (!rows || rows.length === 0) {
            return null;
        }
        const admin = rows[0];
        const roleCodes = rows
            .map((r) => r.roleCode)
            .filter((code) => code !== null);
        return {
            id: Number(admin.id),
            username: admin.username,
            deptId: Number(admin.deptId),
            roleCodes,
        };
    }
};
exports.AdminJwtStrategy = AdminJwtStrategy;
exports.AdminJwtStrategy = AdminJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_1.DataSource,
        token_blacklist_service_1.TokenBlacklistService])
], AdminJwtStrategy);
//# sourceMappingURL=admin-jwt.strategy.js.map