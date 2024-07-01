import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUser,
  CreateUserDto,
  GetUserDto,
  GetUserResponse,
  UserDto,
} from './dto/user.dto';
import { Prisma, User } from '@prisma/client';
import { ExceptionResult } from 'src/common/constants/app.dto';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async get(
    options: {
      select?: Prisma.UserSelect;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>;
      cursor?: Prisma.UserWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: Prisma.Enumerable<Prisma.UserScalarFieldEnum>;
    } = {},
    fetch: 'one' | 'many',
  ): Promise<CreateUserDto | CreateUserDto[] | ExceptionResult> {
    try {
      const result =
        (await fetch) === 'one'
          ? this.prisma.user.findFirst(options)
          : this.prisma.user.findMany(options);
      return result;
    } catch (error) {
      console.log('[user.service.get]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async create(
    options: {
      select?: Prisma.UserSelect;
      data:
        | Prisma.UserUncheckedCreateInput
        | Prisma.UserCreateInput
        | undefined;
    } = { data: undefined },
    prisma?: Prisma.TransactionClient,
  ): Promise<CreateUserDto | ExceptionResult> {
    try {
      const result = await (prisma ?? this.prisma).user.create(options);
      return result;
    } catch (error) {
      console.log('[user.service.create]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }
  async createUser({
    firstName,
    lastName,
  }: CreateUser): Promise<CreateUserDto | ExceptionResult> {
    try {
      //   const userInDB = await this.get(
      //     {
      //       where: {
      //         firstName,
      //       },
      //     },
      //     'one',
      //   );
      //   if (userInDB) {
      //     throw new Error('Already have username');
      //   }
      const created = await this.create({
        data: {
          firstName,
          lastName,
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

  async findUsersByName({
    filter,
    page,
    perPage,
  }: GetUserDto): Promise<GetUserResponse | ExceptionResult> {
    try {
      const count = await this.prisma.user.count();
      const finalPerPage = perPage ? +perPage : +count;
      const paginate = createPaginator({ page, perPage: finalPerPage });
      const where: Prisma.UserWhereInput = filter
        ? {
            OR: [],
          }
        : {};
      if (filter) {
        const OR: Prisma.Enumerable<Prisma.UserWhereInput> = [];
        if (filter.length > 0) {
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
        const result = await paginate<UserDto, Prisma.UserFindManyArgs>(
          this.prisma.user,
          {
            where,
          },
        );
        return result;
      }
    } catch (error) {
      console.log('[user.service.getUser]', error.stack);
    }
  }
  async deleteUser(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Could not delete user with id ${id}: ${error.message}`);
    }
  }
  // async updateUser(
  //   id: number,
  //   firstName: string,
  //   lastName: string,
  // ): Promise<User> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //   });
  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }

  //   return this.prisma.user.update({
  //     where: { id },
  //     data: {
  //       firstName,
  //       lastName,
  //     },
  //   });
  // }
  async updateUser(
    id: number,
    data: { firstName?: string; lastName?: string },
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
}
