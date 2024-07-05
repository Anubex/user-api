import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './strategy/jwt.strategy';
import { AdminsModule } from '../admin/admin.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'admins',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY || '',
      signOptions: { expiresIn: process.env.TOKEN_EXPIRES_IN },
    }),
    AdminsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  exports: [AuthService],
})
export class AuthModule {}
