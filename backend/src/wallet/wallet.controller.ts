import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
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
  withdraw(@Request() req, @Body('amount') amount: number) {
    return this.walletService.withdraw(req.user.id, amount);
  }

  @Get('transactions')
  getTransactions(@Request() req) {
    return this.walletService.getTransactions(req.user.id);
  }
}
