import { ApiProperty } from '@nestjs/swagger';
import { ROLE, STATUS, User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  status: STATUS;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: ROLE;

  @ApiProperty()
  defaultPassword: boolean;

  //   @ApiProperty()
  //   status: STATUS
}
