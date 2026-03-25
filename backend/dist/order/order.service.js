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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../database/entities/order.entity");
const order_item_entity_1 = require("../database/entities/order-item.entity");
const product_entity_1 = require("../database/entities/product.entity");
const user_entity_1 = require("../database/entities/user.entity");
const promotion_service_1 = require("../promotion/promotion.service");
let OrderService = class OrderService {
    constructor(orderRepo, productRepo, userRepo, dataSource, promotionService) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.dataSource = dataSource;
        this.promotionService = promotionService;
    }
    async createOrder(userId, dto) {
        return this.dataSource.transaction(async (manager) => {
            let totalAmount = 0;
            let profitPool = 0;
            const itemsToSave = [];
            for (const item of dto.items) {
                const product = await manager.findOne(product_entity_1.ProductEntity, {
                    where: { id: item.product_id, status: 'on' },
                });
                if (!product)
                    throw new common_1.BadRequestException(`商品 ${item.product_id} 不存在`);
                if (product.stock < item.quantity)
                    throw new common_1.BadRequestException(`商品 ${product.name} 库存不足`);
                const subtotal = Number(product.price) * item.quantity;
                totalAmount += subtotal;
                profitPool += subtotal * Number(product.profitRate);
                const orderItem = manager.create(order_item_entity_1.OrderItemEntity, {
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    subtotal,
                });
                itemsToSave.push(orderItem);
            }
            const order = manager.create(order_entity_1.OrderEntity, {
                userId,
                totalAmount: +totalAmount.toFixed(2),
                profitPool: +profitPool.toFixed(2),
            });
            const savedOrder = await manager.save(order);
            for (const item of itemsToSave) {
                item.orderId = savedOrder.id;
            }
            await manager.save(itemsToSave);
            return {
                order_id: savedOrder.id,
                total_amount: savedOrder.totalAmount,
                profit_pool: savedOrder.profitPool,
            };
        });
    }
    async payOrder(orderId, userId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, userId, status: 'pending' },
        });
        if (!order)
            throw new common_1.NotFoundException('订单不存在或已支付');
        await this.dataSource.transaction(async (manager) => {
            await manager.update(order_entity_1.OrderEntity, orderId, { status: 'done', paidAt: new Date() });
            const user = await this.userRepo.findOne({ where: { id: userId }, select: ['parentId'] });
            if (user?.parentId) {
                await this.promotionService.grantCommission(user.parentId, userId, orderId, Number(order.profitPool), manager);
            }
        });
        return { message: '支付成功，分润将从明日起每天自动释放' };
    }
    async getOrders(userId) {
        const data = await this.orderRepo.find({
            where: { userId },
            select: ['id', 'totalAmount', 'profitPool', 'status', 'paidAt', 'createdAt'],
            order: { id: 'DESC' },
        });
        return { data };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        promotion_service_1.PromotionService])
], OrderService);
//# sourceMappingURL=order.service.js.map