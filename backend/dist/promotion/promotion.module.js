"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const promotion_reward_entity_1 = require("../database/entities/promotion-reward.entity");
const promotion_config_entity_1 = require("../database/entities/promotion-config.entity");
const user_entity_1 = require("../database/entities/user.entity");
const wallet_entity_1 = require("../database/entities/wallet.entity");
const promotion_service_1 = require("./promotion.service");
const promotion_config_service_1 = require("./promotion-config.service");
const promotion_controller_1 = require("./promotion.controller");
let PromotionModule = class PromotionModule {
};
exports.PromotionModule = PromotionModule;
exports.PromotionModule = PromotionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                promotion_reward_entity_1.PromotionRewardEntity,
                promotion_config_entity_1.PromotionConfigEntity,
                user_entity_1.UserEntity,
                wallet_entity_1.WalletEntity,
            ]),
        ],
        controllers: [promotion_controller_1.PromotionController],
        providers: [promotion_service_1.PromotionService, promotion_config_service_1.PromotionConfigService],
        exports: [promotion_service_1.PromotionService, promotion_config_service_1.PromotionConfigService],
    })
], PromotionModule);
//# sourceMappingURL=promotion.module.js.map