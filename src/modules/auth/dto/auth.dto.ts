import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AdminsDto } from 'src/modules/admin/dto/admin.dto';

export class JwtValidatePayload extends PickType(AdminsDto, ['username']) {}

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
