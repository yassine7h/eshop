import { Module } from '@nestjs/common';
import { AuthMoule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DBModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthMoule,
    UserModule,
    DBModule,
  ],
})
export class AppModule {}
