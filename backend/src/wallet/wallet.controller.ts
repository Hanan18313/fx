import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.id);
  }

  @Post('withdraw')
  withdraw(
    @Request() req,
    @Body('amount') amount: number,
    @Body('method') method: string,
  ) {
    return this.walletService.withdraw(req.user.id, amount, method);
  }

  @Get('bank-cards')
  getBankCards(@Request() req) {
    return this.walletService.getBankCards(req.user.id);
  }

  @Get('bank-card')
  getDefaultBankCard(@Request() req) {
    return this.walletService.getDefaultBankCard(req.user.id);
  }

  @Get('transactions')
  getTransactions(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.walletService.getTransactions(req.user.id, Number(page), Number(limit));
  }
}
