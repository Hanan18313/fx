import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../../database/entities/product.entity';
import { ProductMgmtController } from './product-mgmt.controller';
import { ProductMgmtService } from './product-mgmt.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductMgmtController],
  providers: [ProductMgmtService],
})
export class ProductMgmtModule {}
