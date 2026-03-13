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
exports.UserMgmtController = void 0;
const common_1 = require("@nestjs/common");
const admin_jwt_auth_guard_1 = require("../../../common/guards/admin-jwt-auth.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../common/decorators/require-permissions.decorator");
const user_mgmt_service_1 = require("./user-mgmt.service");
let UserMgmtController = class UserMgmtController {
    constructor(userMgmtService) {
        this.userMgmtService = userMgmtService;
    }
    async list(page = 1, pageSize = 10, phone, nickname, role, status) {
        return this.userMgmtService.list({
            page: +page,
            pageSize: +pageSize,
            phone,
            nickname,
            role,
            status: status !== undefined ? +status : undefined,
        });
    }
    async update(id, body) {
        return this.userMgmtService.update(+id, body);
    }
};
exports.UserMgmtController = UserMgmtController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('user:list'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('phone')),
    __param(3, (0, common_1.Query)('nickname')),
    __param(4, (0, common_1.Query)('role')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserMgmtController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('user:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserMgmtController.prototype, "update", null);
exports.UserMgmtController = UserMgmtController = __decorate([
    (0, common_1.Controller)('admin/users'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [user_mgmt_service_1.UserMgmtService])
], UserMgmtController);
//# sourceMappingURL=user-mgmt.controller.js.map