import { Controller, Post, Get, Put, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.id, dto);
  }

  @Post(':id/pay')
  payOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.orderService.payOrder(id, req.user.id);
  }

  @Get()
  getOrders(
    @Request() req,
    @Query('status') status?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.orderService.getOrders(req.user.id, status, +page, +limit);
  }

  @Get(':id')
  getOrderDetail(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.orderService.getOrderDetail(id, req.user.id);
  }

  @Put(':id/cancel')
  cancelOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.orderService.cancelOrder(id, req.user.id);
  }

  @Put(':id/confirm')
  confirmOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.orderService.confirmOrder(id, req.user.id);
  }
}
