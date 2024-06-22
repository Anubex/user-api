import { PrismaService } from './prisma.service';
import { OmitType } from '@nestjs/swagger';

export class PrismaTransaction extends OmitType(PrismaService, [
  '$connect',
  '$disconnect',
  '$on',
  '$transaction',
  '$use',
]) {}
