import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entities';
import { PaginatedResult } from 'prisma-pagination';
import { PaginationMetaDto } from 'src/common/constants/app.dto';

export class UserDto extends UserEntity {}
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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

export class GetUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  page: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  perPage: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  filter: string;
}

export class GetUserResponse implements PaginatedResult<UserDto> {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number;
    next: number;
  };
}
