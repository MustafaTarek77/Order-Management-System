import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
      throw new Error(`Cart is empty for userId: ${userId}`);
    }

    // Create a new order
    const order = await this.prisma.order.create({
      data: {
        userId,
        orderDate: new Date(),
        status: 'PENDING', // Adjust the status as needed
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price * item.quantity,
          })),
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

    return order;
  }

  async getOrder(orderId: number) {
    return this.prisma.order.findUnique({
      where: { orderId },
      include: { orderItems: true },
    });
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
}
