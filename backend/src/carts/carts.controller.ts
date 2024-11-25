import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/getuser.decorator';
import { AuthRoles } from 'src/auth/roles.guard';
import { CartsService } from './carts.service';

type ProductQte = { qte: number; productId: number };

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}
  @AuthRoles(Role.CLIENT)
  @Get('/mine')
  getMyCart(@GetUser() user: User) {
    return this.cartsService.getMine(user);
  }

  @AuthRoles(Role.CLIENT)
  @Post(':id')
  addProductToCart(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    product: { quantity: number; productId: number; append: boolean },
    @GetUser() user: User,
  ) {
    return this.cartsService.addProductToCartDto(id, product, user);
  }

  @AuthRoles(Role.CLIENT)
  @Delete(':id/products/:productId')
  deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser() user: User,
  ) {
    return this.cartsService.deleteProduct(id, productId, user);
  }
}
