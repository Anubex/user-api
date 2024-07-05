import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './modules/auth/auth.controller';
import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsModule } from './modules/admin/admin.module';
import { AdminsService } from './modules/admin/admin.service';
import { AdminsController } from './modules/admin/admin.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      authSource: 'admin',
    }),
    AuthModule,
    AdminsModule,
    UserModule,
    PrismaModule,
  ],
  controllers: [AdminsController, AuthController, UserController],
  providers: [AdminsService, UserService],
})
export class AppModule {}
