import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartsModule } from 'src/carts/carts.module';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [CartsModule],
})
export class OrdersModule {}
