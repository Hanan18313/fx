"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderMgmtModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../../../database/entities/order.entity");
const order_item_entity_1 = require("../../../database/entities/order-item.entity");
const order_mgmt_controller_1 = require("./order-mgmt.controller");
const order_mgmt_service_1 = require("./order-mgmt.service");
let OrderMgmtModule = class OrderMgmtModule {
};
exports.OrderMgmtModule = OrderMgmtModule;
exports.OrderMgmtModule = OrderMgmtModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([order_entity_1.OrderEntity, order_item_entity_1.OrderItemEntity])],
        controllers: [order_mgmt_controller_1.OrderMgmtController],
        providers: [order_mgmt_service_1.OrderMgmtService],
    })
], OrderMgmtModule);
//# sourceMappingURL=order-mgmt.module.js.map