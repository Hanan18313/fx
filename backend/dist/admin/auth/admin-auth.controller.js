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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_service_1 = require("./admin-auth.service");
const admin_login_dto_1 = require("./dto/admin-login.dto");
const admin_jwt_auth_guard_1 = require("../../common/guards/admin-jwt-auth.guard");
const current_admin_decorator_1 = require("../../common/decorators/current-admin.decorator");
let AdminAuthController = class AdminAuthController {
    constructor(adminAuthService) {
        this.adminAuthService = adminAuthService;
    }
    async login(dto, req) {
        const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.ip;
        const userAgent = req.headers["user-agent"];
        return this.adminAuthService.login(dto, ip, userAgent);
    }
    async logout(adminId, username, req) {
        const token = req.headers.authorization?.replace("Bearer ", "");
        const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.ip;
        const userAgent = req.headers["user-agent"];
        await this.adminAuthService.logout(token, adminId, username, ip, userAgent);
        return { message: "退出成功" };
    }
    async getProfile(adminId) {
        return this.adminAuthService.getProfile(adminId);
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Post)("logout"),
    __param(0, (0, current_admin_decorator_1.CurrentAdmin)("id")),
    __param(1, (0, current_admin_decorator_1.CurrentAdmin)("username")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Get)("profile"),
    __param(0, (0, current_admin_decorator_1.CurrentAdmin)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "getProfile", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, common_1.Controller)("admin/auth"),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService])
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map