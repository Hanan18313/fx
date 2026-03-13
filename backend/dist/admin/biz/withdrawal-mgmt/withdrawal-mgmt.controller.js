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
exports.WithdrawalMgmtController = void 0;
const common_1 = require("@nestjs/common");
const admin_jwt_auth_guard_1 = require("../../../common/guards/admin-jwt-auth.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../common/decorators/require-permissions.decorator");
const withdrawal_mgmt_service_1 = require("./withdrawal-mgmt.service");
let WithdrawalMgmtController = class WithdrawalMgmtController {
    constructor(withdrawalMgmtService) {
        this.withdrawalMgmtService = withdrawalMgmtService;
    }
    async list(page = 1, pageSize = 10, status, userId) {
        return this.withdrawalMgmtService.list({
            page: +page,
            pageSize: +pageSize,
            status,
            userId: userId ? +userId : undefined,
        });
    }
    async approve(id) {
        return this.withdrawalMgmtService.approve(+id);
    }
    async reject(id, rejectReason) {
        return this.withdrawalMgmtService.reject(+id, rejectReason);
    }
};
exports.WithdrawalMgmtController = WithdrawalMgmtController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('withdrawal:list'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], WithdrawalMgmtController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, require_permissions_decorator_1.RequirePermissions)('withdrawal:approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WithdrawalMgmtController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, require_permissions_decorator_1.RequirePermissions)('withdrawal:reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('rejectReason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], WithdrawalMgmtController.prototype, "reject", null);
exports.WithdrawalMgmtController = WithdrawalMgmtController = __decorate([
    (0, common_1.Controller)('admin/withdrawals'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [withdrawal_mgmt_service_1.WithdrawalMgmtService])
], WithdrawalMgmtController);
//# sourceMappingURL=withdrawal-mgmt.controller.js.map