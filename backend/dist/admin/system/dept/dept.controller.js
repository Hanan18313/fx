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
exports.DeptController = void 0;
const common_1 = require("@nestjs/common");
const admin_jwt_auth_guard_1 = require("../../../common/guards/admin-jwt-auth.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../common/decorators/require-permissions.decorator");
const dept_service_1 = require("./dept.service");
const create_dept_dto_1 = require("./dto/create-dept.dto");
const update_dept_dto_1 = require("./dto/update-dept.dto");
let DeptController = class DeptController {
    constructor(deptService) {
        this.deptService = deptService;
    }
    async list() {
        return this.deptService.list();
    }
    async create(dto) {
        return this.deptService.create(dto);
    }
    async update(id, dto) {
        return this.deptService.update(id, dto);
    }
    async delete(id) {
        return this.deptService.delete(id);
    }
};
exports.DeptController = DeptController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:dept:list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeptController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:dept:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dept_dto_1.CreateDeptDto]),
    __metadata("design:returntype", Promise)
], DeptController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:dept:update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_dept_dto_1.UpdateDeptDto]),
    __metadata("design:returntype", Promise)
], DeptController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:dept:update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DeptController.prototype, "delete", null);
exports.DeptController = DeptController = __decorate([
    (0, common_1.Controller)('admin/system/depts'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [dept_service_1.DeptService])
], DeptController);
//# sourceMappingURL=dept.controller.js.map