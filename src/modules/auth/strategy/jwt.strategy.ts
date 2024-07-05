import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtValidatePayload } from '../dto/auth.dto';
import { ExceptionResult } from 'src/common/constants/app.dto';
import { AdminsDto } from 'src/modules/admin/dto/admin.dto';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'admins') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY || '',
    });
  }

  async validate(
    payload: JwtValidatePayload,
  ): Promise<AdminsDto | ExceptionResult> {
    return this.authService.validateAdmins(payload);
  }
}
