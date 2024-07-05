import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Admins = createParamDecorator(
  async (_: string | number | symbol, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.admins;
  },
);
