"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const sys_admin_entity_1 = require("../../database/entities/sys-admin.entity");
const sys_login_log_entity_1 = require("../../database/entities/sys-login-log.entity");
const token_blacklist_service_1 = require("../../common/services/token-blacklist.service");
let AdminAuthService = class AdminAuthService {
    constructor(adminRepo, loginLogRepo, jwtService, dataSource, tokenBlacklistService) {
        this.adminRepo = adminRepo;
        this.loginLogRepo = loginLogRepo;
        this.jwtService = jwtService;
        this.dataSource = dataSource;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async login(dto, ip, userAgent) {
        const admin = await this.adminRepo.findOne({
            where: { username: dto.username, deletedAt: null },
        });
        if (!admin) {
            await this.loginLogRepo.save(this.loginLogRepo.create({
                username: dto.username,
                ip,
                userAgent,
                status: 0,
                message: '账号不存在',
            }));
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const match = await bcrypt.compare(dto.password, admin.password);
        if (!match) {
            await this.loginLogRepo.save(this.loginLogRepo.create({
                adminId: admin.id,
                username: dto.username,
                ip,
                userAgent,
                status: 0,
                message: '密码错误',
            }));
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        if (admin.status !== 1) {
            await this.loginLogRepo.save(this.loginLogRepo.create({
                adminId: admin.id,
                username: dto.username,
                ip,
                userAgent,
                status: 0,
                message: '账号已被禁用',
            }));
            throw new common_1.UnauthorizedException('账号已被禁用');
        }
        await this.loginLogRepo.save(this.loginLogRepo.create({
            adminId: admin.id,
            username: admin.username,
            ip,
            userAgent,
            status: 1,
            message: '登录成功',
        }));
        await this.adminRepo.update(admin.id, {
            lastLoginAt: new Date(),
            lastLoginIp: ip,
        });
        const token = this.jwtService.sign({
            id: admin.id,
            username: admin.username,
            type: 'admin',
        });
        return { token };
    }
    async logout(token, adminId, username, ip, userAgent) {
        const decoded = this.jwtService.decode(token);
        if (decoded?.exp) {
            await this.tokenBlacklistService.addToBlacklist(token, decoded.exp);
        }
        await this.loginLogRepo.save(this.loginLogRepo.create({
            adminId,
            username,
            ip,
            userAgent,
            status: 1,
            message: '退出登录',
        }));
    }
    async getProfile(adminId) {
        const admin = await this.adminRepo.findOne({
            where: { id: adminId, deletedAt: null },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('管理员不存在');
        }
        const menus = await this.dataSource.query(`SELECT DISTINCT m.*
       FROM sys_admin_role ar
       JOIN sys_role_menu rm ON rm.role_id = ar.role_id
       JOIN sys_menu m ON m.id = rm.menu_id AND m.status = 1
       JOIN sys_role r ON r.id = ar.role_id AND r.status = 1
       WHERE ar.admin_id = ?
       ORDER BY m.sort ASC, m.id ASC`, [adminId]);
        const permissions = menus
            .filter((m) => Number(m.type) === 3 && m.permission)
            .map((m) => m.permission);
        const menuItems = menus
            .filter((m) => Number(m.type) === 1 || Number(m.type) === 2)
            .map((m) => ({
            id: Number(m.id),
            parentId: Number(m.parent_id),
            name: m.name,
            type: Number(m.type),
            path: m.path,
            component: m.component,
            icon: m.icon,
            sort: Number(m.sort),
            visible: m.visible,
            children: [],
        }));
        const menuTree = this.buildTree(menuItems);
        return {
            id: admin.id,
            username: admin.username,
            realName: admin.realName,
            email: admin.email,
            phone: admin.phone,
            avatar: admin.avatar,
            deptId: admin.deptId,
            permissions,
            menus: menuTree,
        };
    }
    buildTree(items, parentId = 0) {
        const tree = [];
        for (const item of items) {
            if (item.parentId === parentId) {
                const children = this.buildTree(items, item.id);
                if (children.length > 0) {
                    item.children = children;
                }
                tree.push(item);
            }
        }
        return tree;
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sys_admin_entity_1.SysAdminEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(sys_login_log_entity_1.SysLoginLogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.DataSource,
        token_blacklist_service_1.TokenBlacklistService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map