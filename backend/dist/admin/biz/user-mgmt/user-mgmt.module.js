"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMgmtModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../../database/entities/user.entity");
const user_mgmt_controller_1 = require("./user-mgmt.controller");
const user_mgmt_service_1 = require("./user-mgmt.service");
let UserMgmtModule = class UserMgmtModule {
};
exports.UserMgmtModule = UserMgmtModule;
exports.UserMgmtModule = UserMgmtModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity])],
        controllers: [user_mgmt_controller_1.UserMgmtController],
        providers: [user_mgmt_service_1.UserMgmtService],
    })
], UserMgmtModule);
//# sourceMappingURL=user-mgmt.module.js.map