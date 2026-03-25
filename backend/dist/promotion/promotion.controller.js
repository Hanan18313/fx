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
exports.PromotionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const promotion_service_1 = require("./promotion.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entities/user.entity");
let PromotionController = class PromotionController {
    constructor(promotionService, userRepo) {
        this.promotionService = promotionService;
        this.userRepo = userRepo;
    }
    getStats(req) {
        return this.promotionService.getStats(req.user.id);
    }
    getInvitees(req, page = '1', limit = '20') {
        return this.promotionService.getInvitees(req.user.id, +page, +limit);
    }
    getRewards(req, page = '1', limit = '20') {
        return this.promotionService.getRewards(req.user.id, +page, +limit);
    }
    async getInviteCode(req) {
        const user = await this.userRepo.findOne({
            where: { id: req.user.id },
            select: ['inviteCode'],
        });
        return { invite_code: user?.inviteCode };
    }
};
exports.PromotionController = PromotionController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('invitees'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "getInvitees", null);
__decorate([
    (0, common_1.Get)('rewards'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "getRewards", null);
__decorate([
    (0, common_1.Get)('invite-code'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "getInviteCode", null);
exports.PromotionController = PromotionController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('promotion'),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [promotion_service_1.PromotionService,
        typeorm_2.Repository])
], PromotionController);
//# sourceMappingURL=promotion.controller.js.map