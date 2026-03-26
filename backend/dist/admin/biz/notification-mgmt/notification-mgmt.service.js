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
exports.NotificationMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../../../database/entities/notification.entity");
const user_entity_1 = require("../../../database/entities/user.entity");
let NotificationMgmtService = class NotificationMgmtService {
    constructor(notifRepo, userRepo) {
        this.notifRepo = notifRepo;
        this.userRepo = userRepo;
    }
    async list(params) {
        const { page, pageSize, type } = params;
        const qb = this.notifRepo
            .createQueryBuilder('n')
            .leftJoin('users', 'u', 'u.id = n.user_id')
            .addSelect(['u.phone AS userPhone']);
        if (type) {
            qb.andWhere('n.type = :type', { type });
        }
        qb.orderBy('n.created_at', 'DESC');
        const total = await qb.getCount();
        const raw = await qb
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .getRawAndEntities();
        const list = raw.entities.map((notif, idx) => ({
            ...notif,
            userPhone: raw.raw[idx]?.userPhone ?? null,
        }));
        return { list, total, page, pageSize };
    }
    async create(dto) {
        if (dto.userId === 0) {
            const users = await this.userRepo.find({ select: ['id'] });
            const entities = users.map((u) => this.notifRepo.create({
                userId: u.id,
                type: dto.type,
                title: dto.title,
                content: dto.content,
            }));
            await this.notifRepo.save(entities);
            return { message: `已向 ${entities.length} 位用户发送通知` };
        }
        const entity = this.notifRepo.create(dto);
        await this.notifRepo.save(entity);
        return { message: '发送成功' };
    }
    async remove(id) {
        await this.notifRepo.delete(id);
        return { message: '删除成功' };
    }
};
exports.NotificationMgmtService = NotificationMgmtService;
exports.NotificationMgmtService = NotificationMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.NotificationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationMgmtService);
//# sourceMappingURL=notification-mgmt.service.js.map