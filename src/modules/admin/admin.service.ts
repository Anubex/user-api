import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { omit } from 'lodash';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdminsDto,
  CreateAdminsDto,
  GetAdminsDto,
  GetAdminsInfoResponse,
  GetAdminsResponse,
  UpdateAdminsDto,
} from './dto/admin.dto';
import { ExceptionResult } from 'src/common/constants/app.dto';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async get(
    options: {
      select?: Prisma.adminsSelect;
      where?: Prisma.adminsWhereInput;
      orderBy?: Prisma.Enumerable<Prisma.adminsOrderByWithRelationInput>;
      cursor?: Prisma.adminsWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: Prisma.Enumerable<Prisma.AdminsScalarFieldEnum>;
    } = {},
    fetch: 'one' | 'many',
  ): Promise<AdminsDto | AdminsDto[] | ExceptionResult> {
    try {
      const result =
        (await fetch) === 'one'
          ? this.prisma.admins.findFirst(options)
          : this.prisma.admins.findMany(options);
      return result;
    } catch (error) {
      console.log('[admins.service.get]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async create(
    options: {
      select?: Prisma.adminsSelect;
      data:
        | Prisma.adminsUncheckedCreateInput
        | Prisma.adminsCreateInput
        | undefined;
    } = { data: undefined },
    prisma?: Prisma.TransactionClient,
  ): Promise<AdminsDto | ExceptionResult> {
    try {
      const result = await (prisma ?? this.prisma).admins.create(options);
      return result;
    } catch (error) {
      console.log('[admins.service.create]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async update(
    options: {
      select?: Prisma.adminsSelect;
      data: Prisma.adminsUncheckedUpdateInput | Prisma.adminsUpdateInput;
      where: Prisma.adminsWhereUniqueInput;
    } = {
      data: {},
      where: {},
    },
    prisma?: Prisma.TransactionClient,
  ): Promise<AdminsDto | ExceptionResult> {
    try {
      const result = await (prisma ?? this.prisma).admins.update(options);
      return result;
    } catch (error) {
      console.log('[admins.service.update]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async getAdminsInfo(
    adminsDto: AdminsDto,
  ): Promise<GetAdminsInfoResponse | ExceptionResult> {
    try {
      return omit(adminsDto, ['password']);
    } catch (error) {
      console.log('[admins.service.getAdminsInfo]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async getAdmins({
    filter,
    page,
    perPage,
  }: GetAdminsDto): Promise<GetAdminsResponse | ExceptionResult> {
    try {
      const count = await this.prisma.admins.count();
      const finalPerPage = perPage ? +perPage : +count;
      const paginate = createPaginator({ page, perPage: finalPerPage });
      const where: Prisma.adminsWhereInput = filter
        ? {
            OR: [],
          }
        : {};
      if (filter) {
        const OR: Prisma.Enumerable<Prisma.adminsWhereInput> = [];
        OR.push({
          username: {
            contains: filter,
          },
        });
        OR.push({
          firstName: {
            contains: filter,
          },
        });
        OR.push({
          lastName: {
            contains: filter,
          },
        });
        where['OR'] = OR;
      }
      const result = await paginate<AdminsDto, Prisma.adminsFindManyArgs>(
        this.prisma.admins,
        {
          where,
        },
      );
      return result;
    } catch (error) {
      console.log('[admins.service.getAdmins]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async createAdmins({
    username,
    password,
    firstName,
    lastName,
  }: CreateAdminsDto): Promise<AdminsDto | ExceptionResult> {
    try {
      const adminsInDB = await this.get(
        {
          where: {
            username,
          },
        },
        'one',
      );
      if (adminsInDB) {
        throw new Error('Already have username');
      }
      const created = await this.create({
        data: {
          username,
          password: await hash(password ?? process.env.INIT_PASSWORD, 10),
          firstName,
          lastName,
          defaultPassword: password ? false : true,
        },
      });
      return created;
    } catch (error) {
      console.log('[user.service.createUser]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async updateAdmins(
    adminsId: number,
    defaultPassword: boolean,
    updateAdminsDto: UpdateAdminsDto,
  ): Promise<AdminsDto | ExceptionResult> {
    try {
      const { password, ...restUpdateAdminsDto } = updateAdminsDto;
      const result = await this.update({
        data: {
          ...restUpdateAdminsDto,
          password: password ? await hash(password, 10) : undefined,
          defaultPassword: password ? false : defaultPassword,
        },
        where: {
          id: adminsId,
        },
      });
      return result;
    } catch (error) {
      console.log('[admins.service.updateAdmins]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }
}
