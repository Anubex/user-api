import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginatedResult } from 'prisma-pagination';
import { AdminsEntity } from '../entities/admin.entity';
import { PaginationMetaDto } from 'src/common/constants/app.dto';

export class AdminsDto extends AdminsEntity {}

export class GetAdminsInfoResponse extends OmitType(AdminsDto, ['password']) {}

export class GetAdminsDto {
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

export class GetAdminsResponse implements PaginatedResult<AdminsDto> {
  @ApiProperty({ type: [AdminsDto] })
  data: AdminsDto[];

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

export class CreateAdminsDto extends PickType(AdminsDto, [
  'username',
  'password',
  'firstName',
  'lastName',
]) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class UpdateAdminsDto extends PartialType(
  OmitType(AdminsDto, ['id', 'username', 'createdAt', 'updatedAt']),
) {}
