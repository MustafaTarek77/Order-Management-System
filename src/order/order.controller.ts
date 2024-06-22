// src/orders/orders.controller.ts
import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiParam } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':orderId')
  @ApiParam({ name: 'orderId', type: Number })
  async getOrder(@Param() params: { orderId: string }) {
    const orderId = parseInt(params.orderId, 10);
    return this.orderService.getOrder(orderId);
  }

  @Put(':orderId/status')
  @ApiParam({ name: 'orderId', type: Number })
  async updateOrderStatus(
    @Param() params: { orderId: string },
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const orderId = parseInt(params.orderId, 10);
    const { status } = updateOrderStatusDto;
    return this.orderService.updateOrderStatus(orderId, status);
  }
}
