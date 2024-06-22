import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Retrieves order history for a user.' })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @Get(':userId/orders')
  @ApiParam({ name: 'userId', type: Number })
  async getOrderHistory(@Param() params: { userId: string }) {
    const userId = parseInt(params.userId, 10);
    return this.userService.getOrderHistory(userId);
  }
}
