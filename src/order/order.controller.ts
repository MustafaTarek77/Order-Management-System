import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiParam } from '@nestjs/swagger';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary:
      'Creates a new order for the specified user with the products in their cart.',
  })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Retrieves the order details by order ID.' })
  @ApiParam({ name: 'orderId', description: 'Order ID', type: Number })
  @Get(':orderId')
  @ApiParam({ name: 'orderId', type: Number })
  async getOrder(@Param() params: { orderId: string }) {
    const orderId = parseInt(params.orderId, 10);
    return this.orderService.getOrder(orderId);
  }

  @ApiOperation({ summary: 'Updates the status of an order.' })
  @ApiParam({ name: 'orderId', description: 'Order ID', type: Number })
  @ApiBody({ type: UpdateOrderStatusDto })
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

  @ApiOperation({ summary: 'Applies a coupon or discount code to an order.' })
  @ApiBody({
    description: 'Coupon code object',
    type: ApplyCouponDto,
  })
  @Post('apply-coupon')
  async applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
    return this.orderService.applyCoupon(applyCouponDto);
  }
}
