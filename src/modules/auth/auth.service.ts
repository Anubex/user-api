import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { JwtValidatePayload, SignInDto, SignInResponse } from './dto/auth.dto';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { STATUS } from '@prisma/client';
import { compare } from 'bcrypt';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {
  ExceptionResult,
  JwtDecodeDto,
  Token,
} from 'src/common/constants/app.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(
    payload: JwtValidatePayload,
  ): Promise<UserDto | ExceptionResult> {
    const { username } = payload;
    const userInDB = await this.userService.get(
      {
        where: { username },
      },
      'one',
    );
    if (!userInDB) {
      throw new InternalServerErrorException('Cannot get user');
    }
    return userInDB as UserDto;
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isEqual = await compare(password, hashedPassword);
    if (!isEqual) {
      return false;
    }
    return true;
  }

  private createToken(username: string): Token {
    const payload = { username };
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
    return { token };
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<SignInResponse | ExceptionResult> {
    try {
      const { username, password } = signInDto;
      const userInDB = await this.userService.get(
        {
          where: { username },
        },
        'one',
      );
      if (!userInDB) {
        return {
          code: 501,
          message: 'Not found user',
          status: 500,
        };
      }
      const user = userInDB as UserDto;
      if (user?.status !== STATUS.enable) {
        return {
          code: 403,
          message: 'Forbidden',
          status: 403,
        };
      }
      const validate = await this.verifyPassword(password, user.password);
      if (!validate) {
        return {
          code: 503,
          message: 'Cannot validate password',
          status: 500,
        };
      }
      const token = this.createToken(username);
      const decodeJwt = this.jwtService.decode(token.token) as JwtDecodeDto;
      const expiredAt = dayjs(decodeJwt.exp * 1000)
        .utc(true)
        .toDate();
      const result = {
        ...token,
        expiredTime: expiredAt,
      };
      return result;
    } catch (error) {
      console.log('[auth.service.signIn]', error.stack);
      return {
        code: 500,
        message: 'Internal server error',
        status: 500,
      };
    }
  }
}
