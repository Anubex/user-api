import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUser,
  DeleteUserDto,
  GetUserDto,
  GetUserResponse,
  UpdateUserDto,
  UserDto,
} from './dto/user.dto';
import { Prisma, STATUS } from '@prisma/client';
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
  ): Promise<CreateUser | CreateUser[] | ExceptionResult> {
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
  ): Promise<CreateUser | ExceptionResult> {
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
  async update(
    options: {
      select?: Prisma.UserSelect;
      data: Prisma.UserUncheckedUpdateInput | Prisma.UserUpdateInput;
      where: Prisma.UserWhereUniqueInput;
    } = {
      data: {},
      where: {},
    },
    prisma?: Prisma.TransactionClient,
  ): Promise<UserDto | ExceptionResult> {
    try {
      const result = await (prisma ?? this.prisma).user.update(options);
      return result;
    } catch (error) {
      console.log('[user.service.update]', error.stack);
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
  }: CreateUser): Promise<CreateUser | ExceptionResult> {
    try {
      // const userInDB = await this.get(
      //   {
      //     where: {
      //       firstName,
      //     },
      //   },
      //   'one',
      // );
      // if (userInDB) {
      //   throw new Error('Already have username');
      // }
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
            status: {
              in: [STATUS.enable],
            },
            OR: [],
          }
        : {
            status: {
              in: [STATUS.enable],
            },
          };
      if (filter) {
        const OR: Prisma.Enumerable<Prisma.UserWhereInput> = [];
        if (filter.length > 0) {
          OR.push({
            firstName: {
              contains: filter,
            },
          });
        }
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
    } catch (error) {
      console.log('[user.service.getUser]', error.stack);
    }
  }
  async deleteUser(id: number): Promise<UserDto | ExceptionResult> {
    try {
      const result = await this.prisma.user.delete({
        where: { id: Number(id) },
      });
      return result;
    } catch (error) {
      console.log('[user.service.deleteUser]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto | ExceptionResult> {
    try {
      const { ...restUpdateUserDto } = updateUserDto;
      const result = await this.update({
        data: {
          ...restUpdateUserDto,
        },
        where: {
          id: id,
        },
      });
      return result;
    } catch (error) {
      console.log('[user.service.updateUser]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async findById(id: number): Promise<UserDto | ExceptionResult> {
    try {
      const result = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!result) {
        return {
          code: 404,
          message: `User with id ${id} not found.`,
          status: 404,
        };
      }
      return result;
    } catch (error) {
      console.log('[user.service.findById]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }

  async deleteUsersByStatus(): Promise<
    ExceptionResult | { deletedCount: number }
  > {
    try {
      const result = await this.prisma.user.deleteMany({
        where: {
          status: STATUS.remove,
        },
      });
      return { deletedCount: result.count };
    } catch (error) {
      console.log('[user.service.deleteUsersByStatus]', error.stack);
      return {
        code: 500,
        message: error.stack,
        status: 500,
      };
    }
  }
}
