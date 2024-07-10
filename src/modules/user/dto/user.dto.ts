import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entities';
import { PaginatedResult } from 'prisma-pagination';
import { PaginationMetaDto } from 'src/common/constants/app.dto';
import { STATUS } from '@prisma/client';

export class UserDto extends UserEntity {}
export class CreateUser extends PickType(UserEntity, [
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
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}
// test
// export class findById {
//   @ApiProperty()
//   @IsOptional()
//   id: number;
// }
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

export class DeleteUserDto {
  @ApiProperty()
  status: STATUS;
}
