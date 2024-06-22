import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../database/database.service';
import { NotFoundException } from '@nestjs/common';
import { User, Order } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<DatabaseService>(DatabaseService);
  });

  it('should return order history for a valid user', async () => {
    const mockUser: User & { orders: Order[] } = {
      userId: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      address: '123 Main St',
      description: null,
      orders: [
        {
          orderId: 1,
          orderDate: new Date(),
          status: 'completed',
          userId: 1,
          total: 100,
        },
        {
          orderId: 2,
          orderDate: new Date(),
          status: 'pending',
          userId: 1,
          total: 50,
        },
      ],
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

    const result = await service.getOrderHistory(1);

    expect(result).toEqual([
      {
        orderId: 1,
        orderDate: mockUser.orders[0].orderDate,
        status: 'completed',
      },
      {
        orderId: 2,
        orderDate: mockUser.orders[1].orderDate,
        status: 'pending',
      },
    ]);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.getOrderHistory(1)).rejects.toThrow(NotFoundException);
  });
});
