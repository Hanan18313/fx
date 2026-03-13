"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizModule = void 0;
const common_1 = require("@nestjs/common");
const user_mgmt_module_1 = require("./user-mgmt/user-mgmt.module");
const product_mgmt_module_1 = require("./product-mgmt/product-mgmt.module");
const order_mgmt_module_1 = require("./order-mgmt/order-mgmt.module");
const withdrawal_mgmt_module_1 = require("./withdrawal-mgmt/withdrawal-mgmt.module");
const profit_mgmt_module_1 = require("./profit-mgmt/profit-mgmt.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
let BizModule = class BizModule {
};
exports.BizModule = BizModule;
exports.BizModule = BizModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_mgmt_module_1.UserMgmtModule,
            product_mgmt_module_1.ProductMgmtModule,
            order_mgmt_module_1.OrderMgmtModule,
            withdrawal_mgmt_module_1.WithdrawalMgmtModule,
            profit_mgmt_module_1.ProfitMgmtModule,
            dashboard_module_1.DashboardModule,
        ],
    })
], BizModule);
//# sourceMappingURL=biz.module.js.map