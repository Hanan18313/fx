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
const address_entity_1 = require("../database/entities/address.entity");
const promotion_service_1 = require("../promotion/promotion.service");
function generateOrderNo() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return 'ORD' + Date.now() + random;
}
let OrderService = class OrderService {
    constructor(orderRepo, orderItemRepo, productRepo, userRepo, addressRepo, dataSource, promotionService) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.addressRepo = addressRepo;
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
                const productImage = product.images && product.images.length > 0 ? product.images[0] : null;
                const orderItem = manager.create(order_item_entity_1.OrderItemEntity, {
                    productId: product.id,
                    productName: product.name,
                    productImage,
                    price: product.price,
                    quantity: item.quantity,
                    subtotal,
                });
                itemsToSave.push(orderItem);
            }
            let addressSnapshot = null;
            let addressId = null;
            if (dto.address_id) {
                const address = await manager.findOne(address_entity_1.AddressEntity, {
                    where: { id: dto.address_id, userId },
                });
                if (address) {
                    addressId = address.id;
                    addressSnapshot = {
                        name: address.name,
                        phone: address.phone,
                        province: address.province,
                        city: address.city,
                        district: address.district,
                        detail: address.detail,
                    };
                }
            }
            const freightAmount = 0;
            const discountAmount = 0;
            const payAmount = +(totalAmount + freightAmount - discountAmount).toFixed(2);
            const order = manager.create(order_entity_1.OrderEntity, {
                orderNo: generateOrderNo(),
                userId,
                totalAmount: +totalAmount.toFixed(2),
                profitPool: +profitPool.toFixed(2),
                freightAmount,
                discountAmount,
                payAmount,
                remark: dto.remark || null,
                addressId,
                addressSnapshot,
            });
            const savedOrder = await manager.save(order);
            for (const item of itemsToSave) {
                item.orderId = savedOrder.id;
            }
            await manager.save(itemsToSave);
            return {
                order_id: savedOrder.id,
                order_no: savedOrder.orderNo,
                total_amount: savedOrder.totalAmount,
                pay_amount: savedOrder.payAmount,
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
            await manager.update(order_entity_1.OrderEntity, orderId, { status: 'paid', paidAt: new Date() });
            const user = await this.userRepo.findOne({ where: { id: userId }, select: ['parentId'] });
            if (user?.parentId) {
                await this.promotionService.grantCommission(user.parentId, userId, orderId, Number(order.profitPool), manager);
            }
        });
        return { message: '支付成功，分润将从明日起每天自动释放' };
    }
    async getOrders(userId, status, page = 1, limit = 20) {
        const where = { userId };
        if (status)
            where.status = status;
        const [data, total] = await this.orderRepo.findAndCount({
            where,
            select: ['id', 'orderNo', 'totalAmount', 'payAmount', 'profitPool', 'status', 'paidAt', 'createdAt'],
            order: { id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page };
    }
    async getOrderDetail(orderId, userId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, userId },
        });
        if (!order)
            throw new common_1.NotFoundException('订单不存在');
        const items = await this.orderItemRepo.find({
            where: { orderId },
        });
        return { ...order, items };
    }
    async cancelOrder(orderId, userId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, userId },
        });
        if (!order)
            throw new common_1.NotFoundException('订单不存在');
        if (order.status !== 'pending')
            throw new common_1.BadRequestException('只能取消待支付订单');
        await this.orderRepo.update(orderId, { status: 'cancelled' });
        return { message: '订单已取消' };
    }
    async confirmOrder(orderId, userId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, userId },
        });
        if (!order)
            throw new common_1.NotFoundException('订单不存在');
        if (order.status !== 'shipped')
            throw new common_1.BadRequestException('只能确认已发货订单');
        await this.orderRepo.update(orderId, { status: 'done', completedAt: new Date() });
        return { message: '确认收货成功' };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItemEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(address_entity_1.AddressEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        promotion_service_1.PromotionService])
], OrderService);
//# sourceMappingURL=order.service.js.map