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
exports.PromotionMgmtController = void 0;
const common_1 = require("@nestjs/common");
const admin_jwt_auth_guard_1 = require("../../../common/guards/admin-jwt-auth.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../common/decorators/require-permissions.decorator");
const operation_log_decorator_1 = require("../../../common/decorators/operation-log.decorator");
const promotion_mgmt_service_1 = require("./promotion-mgmt.service");
const update_promotion_config_dto_1 = require("./dto/update-promotion-config.dto");
let PromotionMgmtController = class PromotionMgmtController {
    constructor(promotionMgmtService) {
        this.promotionMgmtService = promotionMgmtService;
    }
    getOverview() {
        return this.promotionMgmtService.getOverview();
    }
    getRewards(page = '1', limit = '20', type, startDate, endDate) {
        return this.promotionMgmtService.getRewards(+page, +limit, type, startDate, endDate);
    }
    getConfig() {
        return this.promotionMgmtService.getConfig();
    }
    updateConfig(dto) {
        return this.promotionMgmtService.updateConfig(dto);
    }
};
exports.PromotionMgmtController = PromotionMgmtController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, require_permissions_decorator_1.RequirePermissions)('promotion:overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromotionMgmtController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('rewards'),
    (0, require_permissions_decorator_1.RequirePermissions)('promotion:rewards'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('start_date')),
    __param(4, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], PromotionMgmtController.prototype, "getRewards", null);
__decorate([
    (0, common_1.Get)('config'),
    (0, require_permissions_decorator_1.RequirePermissions)('promotion:config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromotionMgmtController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Put)('config'),
    (0, require_permissions_decorator_1.RequirePermissions)('promotion:config:edit'),
    (0, operation_log_decorator_1.OperationLog)('推广管理', '修改推广配置'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_promotion_config_dto_1.UpdatePromotionConfigDto]),
    __metadata("design:returntype", void 0)
], PromotionMgmtController.prototype, "updateConfig", null);
exports.PromotionMgmtController = PromotionMgmtController = __decorate([
    (0, common_1.Controller)('admin/promotion'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [promotion_mgmt_service_1.PromotionMgmtService])
], PromotionMgmtController);
//# sourceMappingURL=promotion-mgmt.controller.js.map