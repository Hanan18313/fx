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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserController = void 0;
const common_1 = require("@nestjs/common");
const admin_jwt_auth_guard_1 = require("../../../common/guards/admin-jwt-auth.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../common/decorators/require-permissions.decorator");
const current_admin_decorator_1 = require("../../../common/decorators/current-admin.decorator");
const admin_user_service_1 = require("./admin-user.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const update_admin_dto_1 = require("./dto/update-admin.dto");
let AdminUserController = class AdminUserController {
    constructor(adminUserService) {
        this.adminUserService = adminUserService;
    }
    async list(page, pageSize, username, realName, phone, status, deptId) {
        return this.adminUserService.list({
            page: page ? +page : undefined,
            pageSize: pageSize ? +pageSize : undefined,
            username,
            realName,
            phone,
            status: status != null && !isNaN(+status) ? +status : undefined,
            deptId: deptId ? +deptId : undefined,
        });
    }
    async create(dto, adminId) {
        return this.adminUserService.create(dto, adminId);
    }
    async update(id, dto) {
        return this.adminUserService.update(id, dto);
    }
    async resetPassword(id, password) {
        return this.adminUserService.resetPassword(id, password);
    }
};
exports.AdminUserController = AdminUserController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)("system:admin:list"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("pageSize")),
    __param(2, (0, common_1.Query)("username")),
    __param(3, (0, common_1.Query)("realName")),
    __param(4, (0, common_1.Query)("phone")),
    __param(5, (0, common_1.Query)("status")),
    __param(6, (0, common_1.Query)("deptId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)("system:admin:create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_admin_decorator_1.CurrentAdmin)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Number]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, require_permissions_decorator_1.RequirePermissions)("system:admin:update"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_admin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/reset-password"),
    (0, require_permissions_decorator_1.RequirePermissions)("system:admin:reset-pwd"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "resetPassword", null);
exports.AdminUserController = AdminUserController = __decorate([
    (0, common_1.Controller)("admin/system/admins"),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [admin_user_service_1.AdminUserService])
], AdminUserController);
//# sourceMappingURL=admin-user.controller.js.map