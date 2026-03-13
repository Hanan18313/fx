import { Module } from '@nestjs/common';
import { ProfitMgmtController } from './profit-mgmt.controller';
import { ProfitMgmtService } from './profit-mgmt.service';

@Module({
  controllers: [ProfitMgmtController],
  providers: [ProfitMgmtService],
})
export class ProfitMgmtModule {}
