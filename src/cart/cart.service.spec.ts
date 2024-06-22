import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { DatabaseService } from '../database/database.service';
import { CartDto } from './dto/add-update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

describe('CartService', () => {
  let service: CartService;
  let prismaMock: {
    cart: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
    cartItem: {
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    product: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      cartItem: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: DatabaseService,
          useValue: prismaMock as unknown as DatabaseService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add to cart', async () => {
    const addToCartDto: CartDto = {
      userId: 1,
      productId: 1,
      quantity: 2,
    };

    const mockProduct = {
      productId: 1,
      stock: 10,
      price: 15,
    };

    const mockCart = {
      cartId: 1,
      userId: 1,
      cartItems: [
        {
          cartItemId: 1,
          productId: 1,
          quantity: 2,
          price: 15, // Ensure this matches your business logic for price calculation
        },
      ],
    };

    // Mocking Prisma operations
    prismaMock.product.findUnique.mockResolvedValue(mockProduct);
    prismaMock.cart.findUnique.mockResolvedValue(mockCart); // Simulate no existing cart
    prismaMock.cart.create.mockResolvedValue(mockCart); // Mock cart creation

    // Calling the addToCart method
    const result = await service.addToCart(addToCartDto);

    // Assertions
    expect(result).toEqual(mockCart);
    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: { productId: addToCartDto.productId },
    });
    expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: addToCartDto.userId },
      include: { cartItems: true }, // Ensure cartItems are included in the findUnique query
    });
  });

  it('should remove from cart', async () => {
    const removeFromCartDto: RemoveFromCartDto = {
      userId: 1,
      productId: 1,
    };

    const mockCart = {
      cartId: 1,
      userId: 1,
      cartItems: [{ cartItemId: 1, productId: 1, quantity: 2, price: 15 }],
    };

    prismaMock.cart.findUnique.mockResolvedValue(mockCart);
    prismaMock.cartItem.delete.mockResolvedValue({ cartItemId: 1 });

    const result = await service.removeFromCart(removeFromCartDto);

    expect(result).toEqual(mockCart);
    expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: removeFromCartDto.userId },
      include: { cartItems: true },
    });
    expect(prismaMock.cartItem.delete).toHaveBeenCalledWith({
      where: { cartItemId: mockCart.cartItems[0].cartItemId },
    });
  });

  it('should update cart item', async () => {
    const updateCartDto: CartDto = {
      userId: 1,
      productId: 1,
      quantity: 5,
    };

    const mockCart = {
      cartId: 1,
      userId: 1,
      cartItems: [{ cartItemId: 1, productId: 1, quantity: 2, price: 15 }],
    };

    const mockProduct = {
      productId: 1,
      stock: 10,
      price: 15,
    };

    prismaMock.cart.findUnique.mockResolvedValue(mockCart);
    prismaMock.product.findUnique.mockResolvedValue(mockProduct);
    prismaMock.cartItem.update.mockResolvedValue({
      ...mockCart.cartItems[0],
      quantity: 5,
    });

    const result = await service.updateCartItem(updateCartDto);

    expect(result).toEqual(mockCart);
    expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: updateCartDto.userId },
      include: { cartItems: true },
    });
    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: { productId: updateCartDto.productId },
    });
    expect(prismaMock.cartItem.update).toHaveBeenCalledWith({
      where: { cartItemId: mockCart.cartItems[0].cartItemId },
      data: { quantity: updateCartDto.quantity },
    });
  });

  it('should view cart', async () => {
    const userId = 1;

    const mockCart = {
      cartId: 1,
      userId: 1,
      cartItems: [{ cartItemId: 1, productId: 1, quantity: 2, price: 15 }],
    };

    prismaMock.cart.findUnique.mockResolvedValue(mockCart);

    const result = await service.viewCart(userId);

    expect(result).toEqual(mockCart);
    expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
      where: { userId },
      include: { cartItems: true },
    });
  });
});
