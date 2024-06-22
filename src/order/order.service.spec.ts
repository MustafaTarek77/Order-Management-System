import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { DatabaseService } from '../database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let prismaMock: {
    order: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    cart: {
      findUnique: jest.Mock;
    };
    cartItem: {
      deleteMany: jest.Mock;
    };
    product: {
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      order: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      cart: {
        findUnique: jest.fn(),
      },
      cartItem: {
        deleteMany: jest.fn(),
      },
      product: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: DatabaseService,
          useValue: prismaMock as unknown as DatabaseService, // Cast prismaMock to DatabaseService
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order', async () => {
    const createOrderDto: CreateOrderDto = {
      userId: 1,
    };

    const mockCart = {
      cartId: 1,
      userId: 1,
      cartItems: [
        { productId: 1, quantity: 2, price: 10 },
        { productId: 2, quantity: 1, price: 15 },
      ],
    };

    const mockOrder = {
      orderId: 1,
      userId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      total: 35,
      orderItems: [
        { productId: 1, quantity: 2, price: 20 },
        { productId: 2, quantity: 1, price: 15 },
      ],
    };

    prismaMock.cart.findUnique.mockResolvedValue(mockCart);
    prismaMock.order.create.mockResolvedValue(mockOrder);

    const result = await service.createOrder(createOrderDto);

    expect(result).toEqual(mockOrder);
    expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: createOrderDto.userId },
      include: { cartItems: true },
    });
    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: {
        userId: createOrderDto.userId,
        orderDate: expect.any(Date),
        status: 'PENDING',
        total: 35,
        orderItems: {
          create: [
            { productId: 1, quantity: 2, price: 20 },
            { productId: 2, quantity: 1, price: 15 },
          ],
        },
      },
      include: { orderItems: true },
    });
    expect(prismaMock.product.update).toHaveBeenCalledTimes(2); // Assuming two products were updated
    expect(prismaMock.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { cartId: mockCart.cartId },
    });
  });

  it('should throw NotFoundException when trying to create order with empty cart', async () => {
    const createOrderDto: CreateOrderDto = {
      userId: 1,
    };

    prismaMock.cart.findUnique.mockResolvedValue({ userId: 1, cartItems: [] });

    await expect(service.createOrder(createOrderDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: createOrderDto.userId },
      include: { cartItems: true },
    });
    expect(prismaMock.order.create).not.toHaveBeenCalled();
  });

  it('should get an order', async () => {
    const orderId = 1;
    const mockOrder = {
      orderId: 1,
      userId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      total: 35,
      orderItems: [
        { productId: 1, quantity: 2, price: 20 },
        { productId: 2, quantity: 1, price: 15 },
      ],
    };

    prismaMock.order.findUnique.mockResolvedValue(mockOrder);

    const result = await service.getOrder(orderId);

    expect(result).toEqual(mockOrder);
    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { orderId },
      include: { orderItems: true },
    });
  });

  it('should throw NotFoundException when getting a non-existing order', async () => {
    const orderId = 999;

    prismaMock.order.findUnique.mockResolvedValue(null);

    await expect(service.getOrder(orderId)).rejects.toThrow(NotFoundException);
    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { orderId },
      include: { orderItems: true },
    });
  });

  it('should update order status', async () => {
    const orderId = 1;
    const status = 'COMPLETED';
    const mockUpdatedOrder = {
      orderId: 1,
      userId: 1,
      orderDate: new Date(),
      status: 'COMPLETED',
      total: 35,
      orderItems: [
        { productId: 1, quantity: 2, price: 20 },
        { productId: 2, quantity: 1, price: 15 },
      ],
    };

    prismaMock.order.findUnique.mockResolvedValue(mockUpdatedOrder);
    prismaMock.order.update.mockResolvedValue(mockUpdatedOrder);

    const result = await service.updateOrderStatus(orderId, status);

    expect(result).toEqual(mockUpdatedOrder);
    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { orderId },
    });
    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { orderId },
      data: { status },
    });
  });

  it('should throw NotFoundException when updating status of a non-existing order', async () => {
    const orderId = 999;
    const status = 'COMPLETED';

    prismaMock.order.findUnique.mockResolvedValue(null);

    await expect(service.updateOrderStatus(orderId, status)).rejects.toThrow(
      NotFoundException,
    );
    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { orderId },
    });
    expect(prismaMock.order.update).not.toHaveBeenCalled();
  });

  it('should apply a valid coupon to an order', async () => {
    const applyCouponDto: ApplyCouponDto = {
      orderId: 1,
      couponCode: 'SUMMER2024',
    };

    const mockOrder = {
      orderId: 1,
      userId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      total: 35,
      orderItems: [
        { productId: 1, quantity: 2, price: 20 },
        { productId: 2, quantity: 1, price: 15 },
      ],
    };

    prismaMock.order.findUnique.mockResolvedValue(mockOrder);
    prismaMock.order.update.mockResolvedValue({ ...mockOrder, total: 31.5 }); // Mocking the order with applied discount

    const result = await service.applyCoupon(applyCouponDto);

    expect(result).toEqual({ ...mockOrder, total: 31.5 });
    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { orderId: applyCouponDto.orderId },
    });
    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { orderId: applyCouponDto.orderId },
      data: {
        total: 31.5, // Assuming 10% discount is applied
      },
    });
  });

  it('should throw BadRequestException when applying an invalid coupon code', async () => {
    const applyCouponDto: ApplyCouponDto = {
      orderId: 1,
      couponCode: 'INVALIDCODE',
    };

    const mockOrder = {
      orderId: 1,
      userId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      total: 35,
      orderItems: [
        { productId: 1, quantity: 2, price: 20 },
        { productId: 2, quantity: 1, price: 15 },
      ],
    };

    prismaMock.order.findUnique.mockResolvedValue(mockOrder);

    await expect(service.applyCoupon(applyCouponDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { orderId: applyCouponDto.orderId },
    });
    expect(prismaMock.order.update).not.toHaveBeenCalled();
  });
});
