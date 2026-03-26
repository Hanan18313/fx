import { Module } from '@nestjs/common';
import { UserMgmtModule } from './user-mgmt/user-mgmt.module';
import { ProductMgmtModule } from './product-mgmt/product-mgmt.module';
import { OrderMgmtModule } from './order-mgmt/order-mgmt.module';
import { WithdrawalMgmtModule } from './withdrawal-mgmt/withdrawal-mgmt.module';
import { ProfitMgmtModule } from './profit-mgmt/profit-mgmt.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PromotionMgmtModule } from './promotion-mgmt/promotion-mgmt.module';
import { CategoryMgmtModule } from './category-mgmt/category-mgmt.module';
import { BannerMgmtModule } from './banner-mgmt/banner-mgmt.module';
import { ReviewMgmtModule } from './review-mgmt/review-mgmt.module';
import { NotificationMgmtModule } from './notification-mgmt/notification-mgmt.module';

@Module({
  imports: [
    UserMgmtModule,
    ProductMgmtModule,
    OrderMgmtModule,
    WithdrawalMgmtModule,
    ProfitMgmtModule,
    DashboardModule,
    PromotionMgmtModule,
    CategoryMgmtModule,
    BannerMgmtModule,
    ReviewMgmtModule,
    NotificationMgmtModule,
  ],
})
export class BizModule {}
