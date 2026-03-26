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
exports.OrderMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../../database/entities/order.entity");
const order_item_entity_1 = require("../../../database/entities/order-item.entity");
let OrderMgmtService = class OrderMgmtService {
    constructor(orderRepo, orderItemRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
    }
    async list(params) {
        const { page, pageSize, status, userId, startDate, endDate } = params;
        const qb = this.orderRepo
            .createQueryBuilder('o')
            .leftJoin('users', 'u', 'u.id = o.user_id')
            .addSelect(['u.phone AS userPhone', 'u.nickname AS userNickname']);
        if (status) {
            qb.andWhere('o.status = :status', { status });
        }
        if (userId) {
            qb.andWhere('o.user_id = :userId', { userId });
        }
        if (startDate) {
            qb.andWhere('o.created_at >= :startDate', { startDate });
        }
        if (endDate) {
            qb.andWhere('o.created_at <= :endDate', { endDate: `${endDate} 23:59:59` });
        }
        qb.orderBy('o.created_at', 'DESC');
        const total = await qb.getCount();
        const raw = await qb
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .getRawAndEntities();
        const list = raw.entities.map((order, idx) => ({
            ...order,
            userPhone: raw.raw[idx]?.userPhone ?? null,
            userNickname: raw.raw[idx]?.userNickname ?? null,
        }));
        return { list, total, page, pageSize };
    }
    async detail(id) {
        const qb = this.orderRepo
            .createQueryBuilder('o')
            .leftJoin('users', 'u', 'u.id = o.user_id')
            .addSelect(['u.phone AS userPhone', 'u.nickname AS userNickname'])
            .where('o.id = :id', { id });
        const result = await qb.getRawAndEntities();
        const order = result.entities[0];
        if (!order)
            throw new common_1.BadRequestException('订单不存在');
        const items = await this.orderItemRepo.find({ where: { orderId: id } });
        return {
            ...order,
            userPhone: result.raw[0]?.userPhone ?? null,
            userNickname: result.raw[0]?.userNickname ?? null,
            items,
        };
    }
    async updateStatus(id, newStatus) {
        const order = await this.orderRepo.findOneBy({ id });
        if (!order) {
            throw new common_1.BadRequestException('订单不存在');
        }
        const allowedTransitions = {
            pending: ['cancelled'],
            paid: ['shipped', 'cancelled'],
            shipped: ['done'],
        };
        const allowed = allowedTransitions[order.status];
        if (!allowed || !allowed.includes(newStatus)) {
            throw new common_1.BadRequestException(`不允许从 ${order.status} 状态变更为 ${newStatus}`);
        }
        const updateData = { status: newStatus };
        if (newStatus === 'shipped')
            updateData.shippedAt = new Date();
        if (newStatus === 'done')
            updateData.completedAt = new Date();
        if (newStatus === 'cancelled')
            updateData.remark = '管理员取消';
        await this.orderRepo.update(id, updateData);
        return { message: '状态更新成功' };
    }
};
exports.OrderMgmtService = OrderMgmtService;
exports.OrderMgmtService = OrderMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrderMgmtService);
//# sourceMappingURL=order-mgmt.service.js.map