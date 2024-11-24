import { Controller, Get } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthRoles } from 'src/auth/roles.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @AuthRoles(Role.ADMIN, Role.SELLER)
  @Get('')
  getAll() {
    return this.ordersService.getAll();
  }
}
