import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtValidatePayload } from '../dto/auth.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { ExceptionResult } from 'src/common/constants/app.dto';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY || '',
    });
  }

  async validate(
    payload: JwtValidatePayload,
  ): Promise<UserDto | ExceptionResult> {
    return this.authService.validateUser(payload);
  }
}
