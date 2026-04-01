import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { UpsertCartDto } from './dto/upsert-cart.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  list(@Request() req) {
    return this.cartService.list(req.user.id);
  }

  @Post()
  add(@Request() req, @Body() dto: UpsertCartDto) {
    return this.cartService.add(req.user.id, dto);
  }

  @Put(':itemId')
  updateQuantity(
    @Request() req,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(req.user.id, itemId, quantity);
  }

  @Delete()
  clear(@Request() req) {
    return this.cartService.clear(req.user.id);
  }

  @Delete(':itemId')
  remove(@Request() req, @Param('itemId', ParseIntPipe) itemId: number) {
    return this.cartService.remove(req.user.id, itemId);
  }
}
