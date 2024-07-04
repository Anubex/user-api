import { UserDto } from 'src/modules/user/dto/user.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JwtValidatePayload extends PickType(UserDto, ['username']) {}

export class SignInDto {
  @ApiProperty({ example: 'root' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'qweasdzxcASDqwe' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expiredTime: Date;
}
