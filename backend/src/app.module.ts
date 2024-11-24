import { Module } from '@nestjs/common';
import { AuthMoule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DBModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthMoule,
    UsersModule,
    DBModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
