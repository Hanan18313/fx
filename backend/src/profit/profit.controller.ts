import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('profit')
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.profitService.getDashboard(req.user.id);
  }

  @Get('records')
  getRecords(@Request() req) {
    return this.profitService.getRecords(req.user.id);
  }

  @Get('team')
  getTeamProfit(@Request() req) {
    return this.profitService.getTeamProfit(req.user.id);
  }
}
