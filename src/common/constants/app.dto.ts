import { ApiProperty, PickType } from '@nestjs/swagger';
import { PaginateOptions } from 'prisma-pagination';

export class ExceptionResult {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  status: number;
}

export class InternalServerErrorResponse extends PickType(ExceptionResult, [
  'code',
  'message',
]) {}

export interface PaginationQuery extends PaginateOptions {
  limit?: number;
  orderBy?: string;
  sortBy?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
}

interface PaginationMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export class PaginationMetaDto implements PaginationMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  lastPage: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty({ nullable: true })
  prev: number | null;

  @ApiProperty({ nullable: true })
  next: number | null;
}
