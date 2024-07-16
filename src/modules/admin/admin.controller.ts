import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminsService } from './admin.service';
import { AuthGuards } from 'src/common/decorater/auth-guard.decorator';
import {
  AdminsDto,
  CreateAdminsDto,
  GetAdminsDto,
  // GetAdminsInfoResponse,
  GetAdminsResponse,
  UpdateAdminsDto,
} from './dto/admin.dto';
import { InternalServerErrorResponse } from 'src/common/constants/app.dto';
import responseHelper from 'src/common/helper/response.helper';
import { Admins } from 'src/common/decorater/admin-decorater';
import adminsDecorator from './admin.decorator';

@ApiTags('Admin Controller')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  // @Version('1')
  // @Get('info')
  // @AuthGuards()
  // @ApiOkResponse({ type: GetAdminsInfoResponse })
  // async getAdminsInfo(
  //   @Admins() adminsDto: AdminsDto,
  // ): Promise<GetAdminsInfoResponse | InternalServerErrorResponse> {
  //   const result = await this.adminsService.getAdminsInfo(adminsDto);
  //   return responseHelper.parseHttpStatusCode(result);
  // }

  @Version('1')
  @Get()
  @adminsDecorator.getAdminsDecorator()
  @AuthGuards()
  @ApiOkResponse({ type: GetAdminsResponse })
  async getAdmins(
    @Query() getAdminsDto: GetAdminsDto,
  ): Promise<GetAdminsResponse | InternalServerErrorResponse> {
    const result = await this.adminsService.getAdmins(getAdminsDto);
    return responseHelper.parseHttpStatusCode(result);
  }

  @Version('1')
  @Post()
  @AuthGuards()
  @ApiCreatedResponse({ type: AdminsDto })
  async createAdmins(
    @Body() createAdminsDto: CreateAdminsDto,
  ): Promise<AdminsDto | InternalServerErrorResponse> {
    const result = await this.adminsService.createAdmins(createAdminsDto);
    return responseHelper.parseHttpStatusCode(result);
  }

  @Version('1')
  @Patch(':adminId')
  @AuthGuards()
  @ApiOkResponse({ type: AdminsDto })
  async updateAdmins(
    @Admins() adminsDto: AdminsDto,
    @Param('adminsId') adminsId: string,
    @Body() updateAdminsDto: UpdateAdminsDto,
  ): Promise<AdminsDto | InternalServerErrorResponse> {
    const defaultPassword = adminsDto.defaultPassword;
    const result = await this.adminsService.updateAdmins(
      +adminsId,
      defaultPassword,
      updateAdminsDto,
    );
    return responseHelper.parseHttpStatusCode(result);
  }
}
