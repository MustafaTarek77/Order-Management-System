import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { BadRequestException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
            getOrder: jest.fn(),
            updateOrderStatus: jest.fn(),
            applyCoupon: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
      };
      const mockOrder = {
        orderId: 1,
        userId: 1,
        orderItems: [],
        orderDate: new Date(),
        status: 'PENDING',
        total: 100,
      };

      jest.spyOn(orderService, 'createOrder').mockResolvedValue(mockOrder);

      const result = await controller.createOrder(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(orderService.createOrder).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('getOrder', () => {
    it('should retrieve order details by order ID', async () => {
      const orderId = 1;
      const mockOrder = {
        orderId: 1,
        userId: 1,
        orderItems: [],
        orderDate: new Date(),
        status: 'PENDING',
        total: 100,
      };

      jest.spyOn(orderService, 'getOrder').mockResolvedValue(mockOrder);

      const result = await controller.getOrder({ orderId: orderId.toString() });

      expect(result).toEqual(mockOrder);
      expect(orderService.getOrder).toHaveBeenCalledWith(orderId);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the status of an order', async () => {
      const orderId = 1;
      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: 'COMPLETED',
      };

      const mockUpdatedOrder = {
        ...updateOrderStatusDto,
        orderId,
        userId: 1,
        orderItems: [],
        orderDate: new Date(),
        total: 100,
      };

      jest
        .spyOn(orderService, 'updateOrderStatus')
        .mockResolvedValue(mockUpdatedOrder);

      const result = await controller.updateOrderStatus(
        { orderId: orderId.toString() },
        updateOrderStatusDto,
      );

      expect(result).toEqual(mockUpdatedOrder);
      expect(orderService.updateOrderStatus).toHaveBeenCalledWith(
        orderId,
        updateOrderStatusDto.status,
      );
    });
  });

  describe('applyCoupon', () => {
    it('should apply a coupon to an order', async () => {
      const applyCouponDto: ApplyCouponDto = {
        orderId: 1,
        couponCode: 'SUMMER2024',
      };

      const mockUpdatedOrder = {
        ...applyCouponDto,
        userId: 1,
        orderItems: [],
        orderDate: new Date(),
        status: 'PENDING',
        total: 90,
      };

      jest
        .spyOn(orderService, 'applyCoupon')
        .mockResolvedValue(mockUpdatedOrder);

      const result = await controller.applyCoupon(applyCouponDto);

      expect(result).toEqual(mockUpdatedOrder);
      expect(orderService.applyCoupon).toHaveBeenCalledWith(applyCouponDto);
    });

    it('should throw BadRequestException if coupon code is invalid', async () => {
      const applyCouponDto: ApplyCouponDto = {
        orderId: 1,
        couponCode: 'INVALID_COUPON',
      };

      jest
        .spyOn(orderService, 'applyCoupon')
        .mockRejectedValue(new BadRequestException('Invalid coupon code'));

      await expect(controller.applyCoupon(applyCouponDto)).rejects.toThrowError(
        BadRequestException,
      );
      expect(orderService.applyCoupon).toHaveBeenCalledWith(applyCouponDto);
    });
  });
});
