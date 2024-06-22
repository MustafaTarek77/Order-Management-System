import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Order } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getOrderHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get order history for a user', async () => {
    const userId = '1';
    const orders: Order[] = [
      {
        orderId: 1,
        orderDate: new Date(),
        status: 'pending',
        userId: 1,
        total: null,
      },
    ];
    jest.spyOn(service, 'getOrderHistory').mockResolvedValue(orders);
    expect(await controller.getOrderHistory({ userId })).toBe(orders);
  });
});
