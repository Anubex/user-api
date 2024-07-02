import {
  Controller,
  Get,
  Post,
  Body,
  Version,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  CreateUser,
  CreateUserDto,
  GetUserDto,
  GetUserResponse,
  UpdateUserDto,
} from './dto/user.dto';
import { InternalServerErrorResponse } from 'src/common/constants/app.dto';
import responseHelper from 'src/common/helper/response.helper';
import userDecorator from './user.decorator';
import { User } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Post()
  @ApiCreatedResponse({ type: CreateUserDto })
  async createUser(
    @Body() CreateUser: CreateUser,
  ): Promise<CreateUserDto | InternalServerErrorResponse> {
    const result = await this.userService.createUser(CreateUser);
    return responseHelper.parseHttpStatusCode(result);
  }

  @Version('1')
  @Get()
  @userDecorator.getUserDecorator()
  @ApiOkResponse({ type: GetUserResponse })
  async findUsersByName(
    @Query() getUserDto: GetUserDto,
  ): Promise<GetUserResponse | InternalServerErrorResponse> {
    const result = await this.userService.findUsersByName(getUserDto);
    return responseHelper.parseHttpStatusCode(result);
  }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete user' })
  // @ApiParam({ name: 'id', type: Number })
  // deleteUser(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.deleteUser(id);
  // }
  @Delete('remove')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUsersByStatus(): Promise<User[]> {
    return this.userService.deleteUser();
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findUserById(id);
  }
}
