import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDeptEntity } from '../../../database/entities/sys-dept.entity';
import { DeptController } from './dept.controller';
import { DeptService } from './dept.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysDeptEntity])],
  controllers: [DeptController],
  providers: [DeptService],
  exports: [DeptService],
})
export class DeptModule {}
