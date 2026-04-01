"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const user_entity_1 = require("./database/entities/user.entity");
const product_entity_1 = require("./database/entities/product.entity");
const order_entity_1 = require("./database/entities/order.entity");
const order_item_entity_1 = require("./database/entities/order-item.entity");
const profit_record_entity_1 = require("./database/entities/profit-record.entity");
const wallet_entity_1 = require("./database/entities/wallet.entity");
const withdrawal_entity_1 = require("./database/entities/withdrawal.entity");
const sys_admin_entity_1 = require("./database/entities/sys-admin.entity");
const sys_role_entity_1 = require("./database/entities/sys-role.entity");
const sys_admin_role_entity_1 = require("./database/entities/sys-admin-role.entity");
const sys_menu_entity_1 = require("./database/entities/sys-menu.entity");
const sys_role_menu_entity_1 = require("./database/entities/sys-role-menu.entity");
const sys_dept_entity_1 = require("./database/entities/sys-dept.entity");
const sys_role_dept_entity_1 = require("./database/entities/sys-role-dept.entity");
const sys_operation_log_entity_1 = require("./database/entities/sys-operation-log.entity");
const sys_login_log_entity_1 = require("./database/entities/sys-login-log.entity");
const promotion_reward_entity_1 = require("./database/entities/promotion-reward.entity");
const promotion_config_entity_1 = require("./database/entities/promotion-config.entity");
const address_entity_1 = require("./database/entities/address.entity");
const category_entity_1 = require("./database/entities/category.entity");
const banner_entity_1 = require("./database/entities/banner.entity");
const favorite_entity_1 = require("./database/entities/favorite.entity");
const review_entity_1 = require("./database/entities/review.entity");
const notification_entity_1 = require("./database/entities/notification.entity");
const sms_code_entity_1 = require("./database/entities/sms-code.entity");
const bank_card_entity_1 = require("./database/entities/bank-card.entity");
const wallet_transaction_entity_1 = require("./database/entities/wallet-transaction.entity");
const flash_sale_entity_1 = require("./database/entities/flash-sale.entity");
const cart_item_entity_1 = require("./database/entities/cart-item.entity");
const auth_module_1 = require("./auth/auth.module");
const shop_module_1 = require("./shop/shop.module");
const order_module_1 = require("./order/order.module");
const profit_module_1 = require("./profit/profit.module");
const wallet_module_1 = require("./wallet/wallet.module");
const admin_module_1 = require("./admin/admin.module");
const promotion_module_1 = require("./promotion/promotion.module");
const address_module_1 = require("./address/address.module");
const category_module_1 = require("./category/category.module");
const banner_module_1 = require("./banner/banner.module");
const user_module_1 = require("./user/user.module");
const favorite_module_1 = require("./favorite/favorite.module");
const review_module_1 = require("./review/review.module");
const notification_module_1 = require("./notification/notification.module");
const redis_module_1 = require("./common/redis/redis.module");
const flash_sale_module_1 = require("./flash-sale/flash-sale.module");
const cart_module_1 = require("./cart/cart.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: "mysql",
                    host: config.get("DB_HOST", "localhost"),
                    port: config.get("DB_PORT", 3306),
                    username: config.get("DB_USER", "root"),
                    password: config.get("DB_PASSWORD", "123456"),
                    database: config.get("DB_NAME", "mall_profit"),
                    entities: [
                        user_entity_1.UserEntity,
                        product_entity_1.ProductEntity,
                        order_entity_1.OrderEntity,
                        order_item_entity_1.OrderItemEntity,
                        profit_record_entity_1.ProfitRecordEntity,
                        wallet_entity_1.WalletEntity,
                        withdrawal_entity_1.WithdrawalEntity,
                        sys_admin_entity_1.SysAdminEntity,
                        sys_role_entity_1.SysRoleEntity,
                        sys_admin_role_entity_1.SysAdminRoleEntity,
                        sys_menu_entity_1.SysMenuEntity,
                        sys_role_menu_entity_1.SysRoleMenuEntity,
                        sys_dept_entity_1.SysDeptEntity,
                        sys_role_dept_entity_1.SysRoleDeptEntity,
                        sys_operation_log_entity_1.SysOperationLogEntity,
                        sys_login_log_entity_1.SysLoginLogEntity,
                        promotion_reward_entity_1.PromotionRewardEntity,
                        promotion_config_entity_1.PromotionConfigEntity,
                        address_entity_1.AddressEntity,
                        category_entity_1.CategoryEntity,
                        banner_entity_1.BannerEntity,
                        favorite_entity_1.FavoriteEntity,
                        review_entity_1.ReviewEntity,
                        notification_entity_1.NotificationEntity,
                        sms_code_entity_1.SmsCodeEntity,
                        bank_card_entity_1.BankCardEntity,
                        wallet_transaction_entity_1.WalletTransactionEntity,
                        flash_sale_entity_1.FlashSaleEntity,
                        cart_item_entity_1.CartItemEntity,
                    ],
                    synchronize: false,
                    timezone: "+08:00",
                    extra: {
                        typeCast: (field, next) => {
                            if (field.type === 'LONGLONG') {
                                const val = field.string();
                                return val === null ? null : Number(val);
                            }
                            return next();
                        },
                    },
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            shop_module_1.ShopModule,
            order_module_1.OrderModule,
            profit_module_1.ProfitModule,
            wallet_module_1.WalletModule,
            promotion_module_1.PromotionModule,
            address_module_1.AddressModule,
            category_module_1.CategoryModule,
            banner_module_1.BannerModule,
            user_module_1.UserModule,
            favorite_module_1.FavoriteModule,
            review_module_1.ReviewModule,
            notification_module_1.NotificationModule,
            flash_sale_module_1.FlashSaleModule,
            cart_module_1.CartModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map