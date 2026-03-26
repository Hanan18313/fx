"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewMgmtModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const review_entity_1 = require("../../../database/entities/review.entity");
const product_entity_1 = require("../../../database/entities/product.entity");
const user_entity_1 = require("../../../database/entities/user.entity");
const review_mgmt_controller_1 = require("./review-mgmt.controller");
const review_mgmt_service_1 = require("./review-mgmt.service");
let ReviewMgmtModule = class ReviewMgmtModule {
};
exports.ReviewMgmtModule = ReviewMgmtModule;
exports.ReviewMgmtModule = ReviewMgmtModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([review_entity_1.ReviewEntity, product_entity_1.ProductEntity, user_entity_1.UserEntity])],
        controllers: [review_mgmt_controller_1.ReviewMgmtController],
        providers: [review_mgmt_service_1.ReviewMgmtService],
    })
], ReviewMgmtModule);
//# sourceMappingURL=review-mgmt.module.js.map