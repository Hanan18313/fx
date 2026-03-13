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
exports.LogController = void 0;
const common_1 = require("@nestjs/common");
const admin_jwt_auth_guard_1 = require("../../../common/guards/admin-jwt-auth.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../common/decorators/require-permissions.decorator");
const log_service_1 = require("./log.service");
let LogController = class LogController {
    constructor(logService) {
        this.logService = logService;
    }
    async listOperationLogs(page, pageSize, module, action, adminName, startDate, endDate) {
        return this.logService.listOperationLogs({
            page: page ? +page : undefined,
            pageSize: pageSize ? +pageSize : undefined,
            module,
            action,
            adminName,
            startDate,
            endDate,
        });
    }
    async listLoginLogs(page, pageSize, username, status, startDate, endDate) {
        return this.logService.listLoginLogs({
            page: page ? +page : undefined,
            pageSize: pageSize ? +pageSize : undefined,
            username,
            status: status !== undefined ? +status : undefined,
            startDate,
            endDate,
        });
    }
};
exports.LogController = LogController;
__decorate([
    (0, common_1.Get)('operations'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:log:list'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('module')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('adminName')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "listOperationLogs", null);
__decorate([
    (0, common_1.Get)('logins'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:log:list'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('username')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, String, String]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "listLoginLogs", null);
exports.LogController = LogController = __decorate([
    (0, common_1.Controller)('admin/system/logs'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [log_service_1.LogService])
], LogController);
//# sourceMappingURL=log.controller.js.map