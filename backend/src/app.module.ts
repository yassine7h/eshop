import { Module } from '@nestjs/common';
import { AuthMoule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DBModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { FrontendModule } from './frontend/frontend.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthMoule,
    UsersModule,
    DBModule,
    ProductsModule,
    OrdersModule,
    CartsModule,
    FrontendModule,
  ],
})
export class AppModule {}
