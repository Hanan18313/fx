import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { CategoryMgmtController } from './category-mgmt.controller';
import { CategoryMgmtService } from './category-mgmt.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryMgmtController],
  providers: [CategoryMgmtService],
})
export class CategoryMgmtModule {}
