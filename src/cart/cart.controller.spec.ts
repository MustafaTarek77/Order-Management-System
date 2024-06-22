import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartDto } from './dto/add-update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            addToCart: jest.fn(),
            viewCart: jest.fn(),
            updateCartItem: jest.fn(),
            removeFromCart: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToCart', () => {
    it('should add a product to the cart', async () => {
      const addToCartDto: CartDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
      };
      const mockCart = {
        cartItems: [
          {
            cartItemId: 1,
            cartId: 1,
            productId: 1,
            quantity: 2,
            price: 50,
          },
        ],
        cartId: 1,
        userId: 1,
      };

      jest.spyOn(cartService, 'addToCart').mockResolvedValue(mockCart);

      const result = await controller.addToCart(addToCartDto);

      expect(result).toEqual(mockCart);
      expect(cartService.addToCart).toHaveBeenCalledWith(addToCartDto);
    });
  });

  describe('viewCart', () => {
    it("should retrieve the user's cart", async () => {
      const userId = '1';
      const mockCart = {
        cartItems: [
          {
            cartItemId: 1,
            cartId: 1,
            productId: 1,
            quantity: 2,
            price: 50,
          },
        ],
        cartId: 1,
        userId: 1,
      };

      jest.spyOn(cartService, 'viewCart').mockResolvedValue(mockCart);

      const result = await controller.viewCart({ userId });

      expect(result).toEqual(mockCart);
      expect(cartService.viewCart).toHaveBeenCalledWith(parseInt(userId, 10));
    });
  });

  describe('updateCart', () => {
    it('should update the quantity of a product in the cart', async () => {
      const updateCartDto: CartDto = {
        userId: 1,
        productId: 1,
        quantity: 3,
      };
      const mockCart = {
        cartItems: [
          {
            cartItemId: 1,
            cartId: 1,
            productId: 1,
            quantity: 2,
            price: 50,
          },
        ],
        cartId: 1,
        userId: 1,
      };

      jest.spyOn(cartService, 'updateCartItem').mockResolvedValue(mockCart);

      const result = await controller.updateCart(updateCartDto);

      expect(result).toEqual(mockCart);
      expect(cartService.updateCartItem).toHaveBeenCalledWith(updateCartDto);
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from the cart', async () => {
      const removeFromCartDto: RemoveFromCartDto = {
        userId: 1,
        productId: 1,
      };

      const mockCart = {
        cartItems: [
          {
            cartItemId: 1,
            cartId: 1,
            productId: 1,
            quantity: 2,
            price: 50,
          },
        ],
        cartId: 1,
        userId: 1,
      };

      jest.spyOn(cartService, 'removeFromCart').mockResolvedValue(mockCart);

      const result = await controller.removeFromCart(removeFromCartDto);

      expect(result).toEqual(mockCart);
      expect(cartService.removeFromCart).toHaveBeenCalledWith(
        removeFromCartDto,
      );
    });
  });
});
