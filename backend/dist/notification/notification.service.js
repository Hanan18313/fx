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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../database/entities/notification.entity");
let NotificationService = class NotificationService {
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async list(userId, page = 1, limit = 20, type) {
        const where = { userId };
        if (type)
            where.type = type;
        const [data, total] = await this.notificationRepo.findAndCount({
            where,
            order: { id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page };
    }
    async markAsRead(id, userId) {
        const notification = await this.notificationRepo.findOne({ where: { id } });
        if (!notification)
            throw new common_1.NotFoundException('通知不存在');
        if (notification.userId !== userId)
            throw new common_1.ForbiddenException('无权操作');
        await this.notificationRepo.update(id, { isRead: 1 });
        return { message: '已读' };
    }
    async markAllAsRead(userId) {
        await this.notificationRepo.update({ userId, isRead: 0 }, { isRead: 1 });
        return { message: '全部已读' };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.NotificationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map