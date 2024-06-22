import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiParam } from '@nestjs/swagger';
import { CartDto } from './dto/add-update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() addToCartDto: CartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get(':userId')
  @ApiParam({ name: 'userId', type: Number })
  async viewCart(@Param() params: { userId: string }) {
    const userId = parseInt(params.userId, 10);
    return this.cartService.viewCart(userId);
  }

  @Put('update')
  async updateCart(@Body() updateCartDto: CartDto) {
    return this.cartService.updateCartItem(updateCartDto);
  }

  @Delete('remove')
  async removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(removeFromCartDto);
  }
}
