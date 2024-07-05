import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from 'src/modules/auth/guard/role.guard';

export function AuthGuards() {
  return applyDecorators(
    UseGuards(AuthGuard(['admins']), RoleGuard),
    ApiBearerAuth(),
  );
}
