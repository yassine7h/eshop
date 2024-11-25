import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { DBService } from 'src/db/db.service';

@Injectable()
export class CartsService {
  constructor(private db: DBService) {}

  async addProductToCartDto(
    id: number,
    product: { quantity: number; productId: number; append: boolean },
    user: User,
  ) {
    const cart = await this.db.cart.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    if (user.id !== cart.userId)
      throw new ForbiddenException(
        'You are not Authorized to update this card',
      );
    const existingProduct = cart.products.find(
      (cartProduct) => cartProduct.productId === product.productId,
    );
    if (existingProduct) {
      await this.db.cartProduct.update({
        where: {
          cartId_productId: {
            productId: existingProduct.productId,
            cartId: existingProduct.cartId,
          },
        },
        data: {
          quantity:
            product.quantity + (product.append ? existingProduct.quantity : 0),
        },
      });
    } else {
      await this.db.cartProduct.create({
        data: {
          cartId: cart.id,
          productId: product.productId,
          quantity: product.quantity,
        },
      });
    }
    return await this.db.cart.findUnique({
      where: { id: cart.id },
      include: { products: { include: { product: true } } },
    });
  }
  async getMine(user: User) {
    const cart = await this.db.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
          orderBy: { productId: 'asc' },
        },
      },
    });
    return cart;
  }
  async deleteProduct(id: number, productId: number, user: User) {
    const cart = await this.db.cart.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    if (user.id !== cart.userId)
      throw new ForbiddenException(
        'You are not Authorized to update this card',
      );
    await this.db.cartProduct.delete({
      where: { cartId_productId: { productId: productId, cartId: cart.id } },
    });
  }
}
