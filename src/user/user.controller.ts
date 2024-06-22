import { Controller, Get, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId/orders')
  @ApiParam({ name: 'userId', type: Number })
  async getOrderHistory(@Param() params: { userId: string }) {
    const userId = parseInt(params.userId, 10);
    return this.userService.getOrderHistory(userId);
  }
}
