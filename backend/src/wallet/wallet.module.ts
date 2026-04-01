import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from '../database/entities/wallet.entity';
import { WithdrawalEntity } from '../database/entities/withdrawal.entity';
import { BankCardEntity } from '../database/entities/bank-card.entity';
import { WalletTransactionEntity } from '../database/entities/wallet-transaction.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, WithdrawalEntity, BankCardEntity, WalletTransactionEntity])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
