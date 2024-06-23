import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: DatabaseService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId } = createOrderDto;

    // Fetch the user's cart items
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException(`Cart is empty for userId: ${userId}`);
    }

    const orderItems = cart.cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price * item.quantity,
    }));

    // Calculate total order price
    const totalPrice = orderItems.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price;
    }, 0);

    // Create the order with calculated total
    const order = await this.prisma.order.create({
      data: {
        userId,
        orderDate: new Date(),
        status: 'PENDING',
        total: totalPrice,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });
    await Promise.all(
      cart.cartItems.map(async (item) => {
        await this.prisma.product.update({
          where: { productId: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }),
    );

    // Clear the user's cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.cartId },
    });

    await this.prisma.cart.delete({
      where: { userId },
    });

    return order;
  }

  async getOrder(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { orderItems: true },
    });
    if (!order) {
      throw new NotFoundException(`There is no order with this id`);
    }

    return order;
  }

  async updateOrderStatus(orderId: number, status: string) {
    // Check if the order exists
    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Update the order status
    return this.prisma.order.update({
      where: { orderId },
      data: { status },
    });
  }

  async applyCoupon(applyCouponDto: ApplyCouponDto) {
    const { orderId, couponCode } = applyCouponDto;

    // Find the order by orderId
    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new BadRequestException(`Order with ID ${orderId} not found`);
    }

    // Check if coupon code is valid and applicable
    if (couponCode !== 'SUMMER2024') {
      throw new BadRequestException('Invalid coupon code');
    }

    // Apply discount logic
    const discountedTotal = order.total * 0.9; // 10% discount

    // Update order with discounted total and coupon code applied
    return this.prisma.order.update({
      where: { orderId },
      data: {
        total: discountedTotal,
      },
    });
  }
}
