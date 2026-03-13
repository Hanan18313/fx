import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { UserEntity } from "./database/entities/user.entity";
import { ProductEntity } from "./database/entities/product.entity";
import { OrderEntity } from "./database/entities/order.entity";
import { OrderItemEntity } from "./database/entities/order-item.entity";
import { ProfitRecordEntity } from "./database/entities/profit-record.entity";
import { WalletEntity } from "./database/entities/wallet.entity";
import { WithdrawalEntity } from "./database/entities/withdrawal.entity";
import { SysAdminEntity } from "./database/entities/sys-admin.entity";
import { SysRoleEntity } from "./database/entities/sys-role.entity";
import { SysAdminRoleEntity } from "./database/entities/sys-admin-role.entity";
import { SysMenuEntity } from "./database/entities/sys-menu.entity";
import { SysRoleMenuEntity } from "./database/entities/sys-role-menu.entity";
import { SysDeptEntity } from "./database/entities/sys-dept.entity";
import { SysRoleDeptEntity } from "./database/entities/sys-role-dept.entity";
import { SysOperationLogEntity } from "./database/entities/sys-operation-log.entity";
import { SysLoginLogEntity } from "./database/entities/sys-login-log.entity";
import { AuthModule } from "./auth/auth.module";
import { ShopModule } from "./shop/shop.module";
import { OrderModule } from "./order/order.module";
import { ProfitModule } from "./profit/profit.module";
import { WalletModule } from "./wallet/wallet.module";
import { AdminModule } from "./admin/admin.module";
import { RedisModule } from "./common/redis/redis.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get("DB_HOST", "localhost"),
        port: config.get<number>("DB_PORT", 3306),
        username: config.get("DB_USER", "root"),
        password: config.get("DB_PASSWORD", "123456"),
        database: config.get("DB_NAME", "mall_profit"),
        entities: [
          UserEntity,
          ProductEntity,
          OrderEntity,
          OrderItemEntity,
          ProfitRecordEntity,
          WalletEntity,
          WithdrawalEntity,
          SysAdminEntity,
          SysRoleEntity,
          SysAdminRoleEntity,
          SysMenuEntity,
          SysRoleMenuEntity,
          SysDeptEntity,
          SysRoleDeptEntity,
          SysOperationLogEntity,
          SysLoginLogEntity,
        ],
        synchronize: false, // 不自动改表，使用 init.sql 管理表结构
        timezone: "+08:00",
        extra: {
          typeCast: (field: any, next: () => any) => {
            if (field.type === 'LONGLONG') {
              const val = field.string();
              return val === null ? null : Number(val);
            }
            return next();
          },
        },
      }),
    }),

    ScheduleModule.forRoot(),

    RedisModule,

    AuthModule,
    ShopModule,
    OrderModule,
    ProfitModule,
    WalletModule,
    AdminModule,
  ],
})
export class AppModule {}
