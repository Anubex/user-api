import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'First name', description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Last name', description: 'Last name of the user' })
  lastName: string;
}

export class CreateUser extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
]) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
