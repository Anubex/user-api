import { ApiProperty } from '@nestjs/swagger';
import { admins, ROLE, STATUS } from '@prisma/client';

export class AdminsEntity implements admins {
  @ApiProperty()
  id: number;

  @ApiProperty()
  status: STATUS;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: ROLE;

  @ApiProperty()
  defaultPassword: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
