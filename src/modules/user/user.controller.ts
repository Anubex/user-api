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
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateUser, CreateUserDto } from './dto/user.dto';
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

  @Get()
  @ApiOperation({ summary: 'Find users by name' })
  @ApiQuery({ name: 'query', required: true })
  async findUsersByName(@Query('query') query: string): Promise<User[]> {
    return this.userService.findUsersByName(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: Number })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateUserDto })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(
      id,
      updateUserDto.firstName,
      updateUserDto.lastName,
    );
  }
}
