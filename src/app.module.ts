import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './modules/auth/auth.controller';
import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      authSource: 'admin',
    }),
    UserModule,
    PrismaModule,
  ],
  controllers: [AuthController, UserController],
  providers: [UserService],
})
export class AppModule {}
