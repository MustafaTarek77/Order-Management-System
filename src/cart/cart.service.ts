import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CartDto } from './dto/add-update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: DatabaseService) {}

  async addToCart(addToCartDto: CartDto) {
    const { userId, productId, quantity } = addToCartDto;

    // Check if the user already has a cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    let product = await this.prisma.product.findUnique({
      where: { productId },
    });

    if (quantity > product.stock) {
      throw new Error(`Not enough resources`);
    }

    if (!cart) {
      // If the cart doesn't exist, create it
      cart = await this.prisma.cart.create({
        data: {
          userId,
          cartItems: {
            create: {
              productId,
              quantity,
              price: product.price,
            },
          },
        },
        include: { cartItems: true },
      });
    } else {
      // Check if the product is already in the cart
      const existingCartItem = cart.cartItems.find(
        (item) => item.productId === productId,
      );

      if (existingCartItem) {
        // If the product is already in the cart, update the quantity
        await this.prisma.cartItem.update({
          where: { cartItemId: existingCartItem.cartItemId },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        // If the product is not in the cart, add it to the cart

        await this.prisma.cartItem.create({
          data: {
            cartId: cart.cartId,
            productId,
            quantity,
            price: product.price,
          },
        });
      }
    }

    // Return the updated cart
    return await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
  }

  async viewCart(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
  }

  async updateCartItem(updateCartDto: CartDto) {
    const { userId, productId, quantity } = updateCartDto;

    // Check if the user already has a cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    let product = await this.prisma.product.findUnique({
      where: { productId },
    });

    if (!cart) {
      throw new Error(`Cart not found for userId: ${userId}`);
    }

    if (quantity > product.stock) {
      throw new Error(`Not enough resources`);
    }

    // Find the cart item to update
    const cartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );

    if (!cartItem) {
      throw new Error(`Product with ID ${productId} not found in the cart`);
    }

    // Update the quantity of the cart item
    await this.prisma.cartItem.update({
      where: { cartItemId: cartItem.cartItemId },
      data: { quantity },
    });

    // Return the updated cart
    return await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
  }

  async removeFromCart(removeFromCartDto: RemoveFromCartDto) {
    const { userId, productId } = removeFromCartDto;

    // Check if the user already has a cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new Error(`Cart not found for userId: ${userId}`);
    }

    // Find the cart item to remove
    const cartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );

    if (!cartItem) {
      throw new Error(`Product with ID ${productId} not found in the cart`);
    }

    // Remove the cart item
    await this.prisma.cartItem.delete({
      where: { cartItemId: cartItem.cartItemId },
    });

    // Return the updated cart
    return await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
  }
}