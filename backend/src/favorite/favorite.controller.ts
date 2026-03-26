import { Controller, Get, Post, Delete, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  list(@Request() req) {
    return this.favoriteService.list(req.user.id);
  }

  @Post(':productId')
  add(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.favoriteService.add(req.user.id, productId);
  }

  @Delete(':productId')
  remove(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.favoriteService.remove(req.user.id, productId);
  }
}
