import { Module } from '@nestjs/common';
import { UserMgmtModule } from './user-mgmt/user-mgmt.module';
import { ProductMgmtModule } from './product-mgmt/product-mgmt.module';
import { OrderMgmtModule } from './order-mgmt/order-mgmt.module';
import { WithdrawalMgmtModule } from './withdrawal-mgmt/withdrawal-mgmt.module';
import { ProfitMgmtModule } from './profit-mgmt/profit-mgmt.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    UserMgmtModule,
    ProductMgmtModule,
    OrderMgmtModule,
    WithdrawalMgmtModule,
    ProfitMgmtModule,
    DashboardModule,
  ],
})
export class BizModule {}
