import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalEntity } from '../../../database/entities/withdrawal.entity';
import { WalletEntity } from '../../../database/entities/wallet.entity';
import { WithdrawalMgmtController } from './withdrawal-mgmt.controller';
import { WithdrawalMgmtService } from './withdrawal-mgmt.service';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalEntity, WalletEntity])],
  controllers: [WithdrawalMgmtController],
  providers: [WithdrawalMgmtService],
})
export class WithdrawalMgmtModule {}
