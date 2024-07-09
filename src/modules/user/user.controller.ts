import {
  Controller,
  Get,
  Post,
  Body,
  Version,
  Delete,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CreateUser,
  GetUserDto,
  GetUserResponse,
  UpdateUserDto,
  UserDto,
} from './dto/user.dto';
import { InternalServerErrorResponse } from 'src/common/constants/app.dto';
import responseHelper from 'src/common/helper/response.helper';
import userDecorator from './user.decorator';
import { AuthGuards } from 'src/common/decorater/auth-guard.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Post()
  @AuthGuards()
  @ApiCreatedResponse({ type: CreateUser })
  async create(
    @Body() CreateUser: CreateUser,
  ): Promise<CreateUser | InternalServerErrorResponse> {
    const result = await this.userService.createUser(CreateUser);
    return responseHelper.parseHttpStatusCode(result);
  }

  @Version('1')
  @Get()
  @AuthGuards()
  @userDecorator.getUserDecorator()
  @ApiOkResponse({ type: GetUserResponse })
  async findUsersByName(
    @Query() getUserDto: GetUserDto,
  ): Promise<GetUserResponse | InternalServerErrorResponse> {
    const result = await this.userService.findUsersByName(getUserDto);
    return responseHelper.parseHttpStatusCode(result);
  }
  @Delete(':id')
  @AuthGuards()
  @ApiOkResponse({ type: UserDto })
  async deleteUser(
    @Param('id') userid: number,
  ): Promise<UserDto | InternalServerErrorResponse> {
    const result = await this.userService.deleteUser(userid);
    return responseHelper.parseHttpStatusCode(result);
  }
  @Patch(':id')
  @AuthGuards()
  @ApiOkResponse({ type: UserDto })
  async updateUser(
    @Param('id') userid: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto | InternalServerErrorResponse> {
    const result = await this.userService.updateUser(userid, updateUserDto);
    return responseHelper.parseHttpStatusCode(result);
  }

  @Get(':id')
  @AuthGuards()
  @ApiOkResponse({ type: UserDto })
  async getUserById(
    @Param('id') userId: number,
  ): Promise<UserDto | InternalServerErrorResponse> {
    const result = await this.userService.findById(userId);
    return responseHelper.parseHttpStatusCode(result);
  }
}
