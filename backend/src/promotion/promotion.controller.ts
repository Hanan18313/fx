import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('promotion')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  @Get('stats')
  getStats(@Request() req) {
    return this.promotionService.getStats(req.user.id);
  }

  @Get('invitees')
  getInvitees(
    @Request() req,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.promotionService.getInvitees(req.user.id, +page, +limit);
  }

  @Get('rewards')
  getRewards(
    @Request() req,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.promotionService.getRewards(req.user.id, +page, +limit);
  }

  @Get('invite-code')
  async getInviteCode(@Request() req) {
    const user = await this.userRepo.findOne({
      where: { id: req.user.id },
      select: ['inviteCode'],
    });
    return { invite_code: user?.inviteCode };
  }
}
