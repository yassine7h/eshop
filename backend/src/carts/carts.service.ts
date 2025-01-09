import {
  BadRequestException,
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
    const productDetails = await this.db.product.findUnique({
      where: { id: product.productId },
    });

    if (!productDetails) {
      throw new NotFoundException('Product not found');
    }

    const requiredQuantity = product.quantity;
    let existingQuantityInCart = 0;

    const existingProduct = cart.products.find(
      (cartProduct) => cartProduct.productId === product.productId,
    );

    if (existingProduct) {
      existingQuantityInCart = existingProduct.quantity;
    }

    const newQuantity = product.append
      ? existingQuantityInCart + requiredQuantity
      : requiredQuantity;

    if (newQuantity > productDetails.stock) {
      throw new BadRequestException(
        `Insufficient stock. Only ${productDetails.stock} items are available.`,
      );
    }

    if (existingProduct) {
      await this.db.cartProduct.update({
        where: {
          cartId_productId: {
            productId: existingProduct.productId,
            cartId: existingProduct.cartId,
          },
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      await this.db.cartProduct.create({
        data: {
          cartId: cart.id,
          productId: product.productId,
          quantity: requiredQuantity,
        },
      });
    }

    await this.db.product.update({
      where: { id: product.productId },
      data: {
        stock: productDetails.stock - requiredQuantity,
      },
    });
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
    const existingProduct = cart.products.find(
      (cartProduct) => cartProduct.productId === productId,
    );

    if (!existingProduct) {
      throw new NotFoundException('Product not found in the cart');
    }
    const quantityInCart = existingProduct.quantity;
    await this.db.cartProduct.delete({
      where: { cartId_productId: { productId: productId, cartId: cart.id } },
    });
    const product = await this.db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.db.product.update({
      where: { id: productId },
      data: {
        stock: product.stock + quantityInCart,
      },
    });
  }
}
