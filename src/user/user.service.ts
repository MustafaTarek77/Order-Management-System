import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  async getOrderHistory(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: { orders: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Map orders
    return user.orders.map((order) => ({
      orderId: order.orderId,
      orderDate: order.orderDate,
      status: order.status,
    }));
  }
}
