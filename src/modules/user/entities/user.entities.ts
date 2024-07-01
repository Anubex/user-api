import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
  //   @ApiProperty()
  //   status: STATUS
}
