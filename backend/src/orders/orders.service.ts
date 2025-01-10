import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, User } from '@prisma/client';
import { DBService } from 'src/db/db.service';

@Injectable()
export class OrdersService {
  constructor(private db: DBService) {}

  async getAll() {
    const orders = await this.db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    const transformedOrders = orders.map((order) => {
      delete order.user.password;
      delete order.user.roles;
      return {
        ...order,
        products: order.products.map((orderProduct) => ({
          ...orderProduct.product,
          quantity: orderProduct.quantity,
        })),
      };
    });
    return transformedOrders;
  }

  async getAllMine(user: User) {
    const allOrders = await this.getAll();
    return allOrders.filter((order) => order.userId === user.id);
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.db.order.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!order) throw new NotFoundException('Order not Found');
    if (status === OrderStatus.CANCELED || status === OrderStatus.REJECTED) {
      const updateStockPromises = order.products.map(async (orderProduct) => {
        await this.db.product.update({
          where: { id: orderProduct.productId },
          data: {
            stock: { increment: orderProduct.quantity },
          },
        });
      });
      await Promise.all(updateStockPromises);
    }
    return this.db.order.update({
      where: { id },
      data: { status: status },
    });
  }

  async cancelOrder(id: number, userId: number) {
    const order = await this.db.order.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!order) throw new NotFoundException('Order not Found');
    if (order.status !== OrderStatus.RESERVED || order.userId !== userId)
      throw new ForbiddenException('You cannot cancel this Order');
    const updateStockPromises = order.products.map(async (orderProduct) => {
      await this.db.product.update({
        where: { id: orderProduct.productId },
        data: {
          stock: { increment: orderProduct.quantity },
        },
      });
    });
    await Promise.all(updateStockPromises);
    return this.db.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELED },
    });
  }

  async newOrder(order: { address: string; cartId: number }, user: User) {
    const cart = await this.db.cart.findUnique({
      where: { id: order.cartId },
      include: { products: { include: { product: true } } },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    if (cart.products.length === 0) {
      throw new NotAcceptableException(
        'Cart is empty. Cannot create an order.',
      );
    }
    if (user.id !== cart.userId)
      throw new ForbiddenException('You cannot order this cart');
    const createdOrder = await this.db.order.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        address: order.address,
      },
    });
    const orderProducts = cart.products.map((cartProduct) => ({
      orderId: createdOrder.id,
      productId: cartProduct.product.id,
      quantity: cartProduct.quantity,
    }));
    await this.db.orderProduct.createMany({
      data: orderProducts,
    });
    await this.db.cartProduct.deleteMany({
      where: { cartId: cart.id },
    });
    return createdOrder;
  }
  // async updateStatus(id: number, status: OrderStatus) {
  //   const order = this.db.order.findUnique({
  //     where: { id },
  //   });
  //   if (!order) throw new NotFoundException('Order not Found');
  //   return this.db.order.update({
  //     where: { id },
  //     data: { status },
  //   });
  // }

  // async updateStatus(id: number, status: OrderStatus) {
  //   const order = await this.db.order.findUnique({
  //     where: { id },
  //     include: { products: { include: { product: true } } }, // Include products
  //   });

  //   if (!order) throw new NotFoundException('Order not Found');

  //   if (status === OrderStatus.VALIDATED) {
  //     // Update product quantities in the database
  //     for (const orderProduct of order.products) {
  //       const product = orderProduct.product;
  //       if (product.stock < orderProduct.quantity) {
  //         throw new NotAcceptableException(
  //           `Insufficient stock for product: ${product.name}`,
  //         );
  //       }

  //       // Decrement stock
  //       await this.db.product.update({
  //         where: { id: product.id },
  //         data: { stock: product.stock - orderProduct.quantity },
  //       });
  //     }
  //   }

  //   return this.db.order.update({
  //     where: { id },
  //     data: { status },
  //   });
  // }
}
