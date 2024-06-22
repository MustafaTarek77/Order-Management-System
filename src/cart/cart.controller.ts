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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartDto } from './dto/add-update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary:
      "Adds a product to the user's cart or updates the quantity if the product is already in the cart.",
  })
  @ApiBody({ type: CartDto })
  @Post('add')
  async addToCart(@Body() addToCartDto: CartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @ApiOperation({ summary: "Retrieves the user's cart." })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @Get(':userId')
  @ApiParam({ name: 'userId', type: Number })
  async viewCart(@Param() params: { userId: string }) {
    const userId = parseInt(params.userId, 10);
    return this.cartService.viewCart(userId);
  }

  @ApiOperation({ summary: 'Updates the quantity of a product in the cart.' })
  @ApiBody({ type: CartDto }) // Replace with your DTO type
  @Put('update')
  async updateCart(@Body() updateCartDto: CartDto) {
    return this.cartService.updateCartItem(updateCartDto);
  }

  @ApiOperation({ summary: 'Removes a product from the cart.' })
  @ApiParam({ name: 'productId', description: 'Product ID', type: Number })
  @Delete('remove')
  async removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(removeFromCartDto);
  }
}
