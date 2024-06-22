import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartController } from './cart/cart.controller';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { CartService } from './cart/cart.service';
import { DatabaseModule } from './database/database.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [DatabaseModule, CartModule, OrderModule],
  controllers: [AppController, CartController, OrderController],
  providers: [AppService, OrderService, CartService],
})
export class AppModule {}
