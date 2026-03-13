import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfitRecordEntity } from '../database/entities/profit-record.entity';
import { ProfitController } from './profit.controller';
import { ProfitService } from './profit.service';
import { ProfitEngineService } from './profit-engine.service';
import { ProfitReleaseJob } from './profit-release.job';

@Module({
  imports: [TypeOrmModule.forFeature([ProfitRecordEntity])],
  controllers: [ProfitController],
  providers: [ProfitService, ProfitEngineService, ProfitReleaseJob],
  exports: [ProfitEngineService],
})
export class ProfitModule {}
