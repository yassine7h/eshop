import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderStatus, Role, User } from '@prisma/client';
import { AuthRoles } from 'src/auth/roles.guard';
import { OrdersService } from './orders.service';
import { GetUser } from 'src/auth/getuser.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @AuthRoles(Role.ADMIN, Role.SELLER)
  @Get('')
  getAll() {
    return this.ordersService.getAll();
  }
  @AuthRoles(Role.CLIENT)
  @Get('/mine')
  getAllMine(@GetUser() user: User) {
    return this.ordersService.getAllMine(user);
  }

  @AuthRoles(Role.ADMIN, Role.SELLER)
  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { status: OrderStatus },
  ) {
    return this.ordersService.updateStatus(id, data.status);
  }

  @AuthRoles(Role.CLIENT)
  @Patch(':id/cancel')
  cancelOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancelOrder(id);
  }
  @AuthRoles(Role.CLIENT)
  @Post('')
  newOrder(
    @Body() order: { address: string; cartId: number },
    @GetUser() user: User,
  ) {
    return this.ordersService.newOrder(order, user);
  }
}
