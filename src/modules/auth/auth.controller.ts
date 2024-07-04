import { Body, Controller, Post, Version } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignInResponse } from './dto/auth.dto';
import { InternalServerErrorResponse } from 'src/common/constants/app.dto';
import responseHelper from 'src/common/helper/response.helper';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('sign-in')
  @ApiCreatedResponse({ type: SignInResponse })
  @ApiBadRequestResponse({ type: InternalServerErrorResponse })
  @ApiForbiddenResponse({ type: InternalServerErrorResponse })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponse })
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<SignInResponse | InternalServerErrorResponse> {
    const result = await this.authService.signIn(signInDto);
    return responseHelper.parseHttpStatusCode(result);
  }
}
