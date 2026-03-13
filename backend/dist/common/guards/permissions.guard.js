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
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("typeorm");
const require_permissions_decorator_1 = require("../decorators/require-permissions.decorator");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector, dataSource) {
        this.reflector = reflector;
        this.dataSource = dataSource;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(require_permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const admin = request.user;
        if (!admin)
            throw new common_1.ForbiddenException('未登录');
        const roleCodes = admin.roleCodes || [];
        if (roleCodes.includes('super_admin')) {
            return true;
        }
        const permissions = await this.getAdminPermissions(admin.id);
        admin.permissions = permissions;
        const hasPermission = requiredPermissions.every((p) => permissions.includes(p));
        if (!hasPermission) {
            throw new common_1.ForbiddenException('没有操作权限');
        }
        return true;
    }
    async getAdminPermissions(adminId) {
        const rows = await this.dataSource.query(`SELECT DISTINCT m.permission
       FROM sys_admin_role ar
       JOIN sys_role_menu rm ON rm.role_id = ar.role_id
       JOIN sys_menu m ON m.id = rm.menu_id
       WHERE ar.admin_id = ? AND m.permission IS NOT NULL AND m.status = 1`, [adminId]);
        return rows.map((r) => r.permission);
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_1.DataSource])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map