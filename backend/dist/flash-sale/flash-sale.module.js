"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSaleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const flash_sale_entity_1 = require("../database/entities/flash-sale.entity");
const flash_sale_controller_1 = require("./flash-sale.controller");
const flash_sale_service_1 = require("./flash-sale.service");
let FlashSaleModule = class FlashSaleModule {
};
exports.FlashSaleModule = FlashSaleModule;
exports.FlashSaleModule = FlashSaleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flash_sale_entity_1.FlashSaleEntity])],
        controllers: [flash_sale_controller_1.FlashSaleController],
        providers: [flash_sale_service_1.FlashSaleService],
    })
], FlashSaleModule);
//# sourceMappingURL=flash-sale.module.js.map