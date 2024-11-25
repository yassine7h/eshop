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
    const order = this.db.order.findUnique({
      where: { id },
    });
    if (!order) throw new NotFoundException('Order not Found');
    return this.db.order.update({
      where: { id },
      data: { status },
    });
  }

  async cancelOrder(id: number) {
    const order = await this.db.order.findUnique({
      where: { id },
    });
    if (!order) throw new NotFoundException('Order not Found');
    if (order.status !== OrderStatus.RESERVED)
      throw new ForbiddenException('You cannot cancel this Order');
    return this.db.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELED },
    });
  }

  async newOrder(order: { address: string; cartId: number }, user: User) {
    const cart = await this.db.cart.findUnique({
      where: { id: order.cartId },
      include: { products: { include: { product: true } } }, // Include products with details
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
      orderId: createdOrder.id, // Link to the created order
      productId: cartProduct.product.id, // Link to the product
      quantity: cartProduct.quantity, // Save the quantity
    }));

    await this.db.orderProduct.createMany({
      data: orderProducts,
    });

    await this.db.cartProduct.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  }
}
