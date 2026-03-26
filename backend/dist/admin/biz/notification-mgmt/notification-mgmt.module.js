"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMgmtModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("../../../database/entities/notification.entity");
const user_entity_1 = require("../../../database/entities/user.entity");
const notification_mgmt_controller_1 = require("./notification-mgmt.controller");
const notification_mgmt_service_1 = require("./notification-mgmt.service");
let NotificationMgmtModule = class NotificationMgmtModule {
};
exports.NotificationMgmtModule = NotificationMgmtModule;
exports.NotificationMgmtModule = NotificationMgmtModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([notification_entity_1.NotificationEntity, user_entity_1.UserEntity])],
        controllers: [notification_mgmt_controller_1.NotificationMgmtController],
        providers: [notification_mgmt_service_1.NotificationMgmtService],
    })
], NotificationMgmtModule);
//# sourceMappingURL=notification-mgmt.module.js.map