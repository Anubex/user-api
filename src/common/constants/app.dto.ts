import { ApiProperty, PickType } from '@nestjs/swagger';

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
