import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Req,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateRequestServiceDto } from 'src/modules/requestService/dto/create-request-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { ListDetailServiceResponse } from 'src/modules/listDetailService/types/listDetailService.types';
import { RequestServiceService } from 'src/modules/requestService/requestService.service';
import { RequestServiceResponse } from 'src/modules/requestService/types/requestService.types';
import { GetAllRequestServiceDto } from 'src/modules/requestService/dto/get-all-request-service.dto';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express/multer';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestServiceEntity } from 'src/database/entities/request-service.entity';
import { FilterRequestServiceDto } from './dto/filter-request-service.dto';
import { FixerApprovalDto } from './dto/fixer-approval.dto';
import { UpdateRequestServiceDto } from './dto/update-request-service.dto';

@Controller('requestService')
export class RequestServiceController {
  constructor(private readonly requestServiceService: RequestServiceService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Req() req: Request, // dùng req trực tiếp để debug & lấy form-data chuẩn
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<MessageResponse> {
    const body = req.body; // Đây giờ là object key-value thực tế
    return await this.requestServiceService.createRequestService(body, files);
  }

  @Get()
  async getAll(): Promise<RequestServiceResponse[]> {
    return await this.requestServiceService.getAll();
  }

  @Get('allbyuserid/:id')
  async getAllByUserId(
    @Param('id') id: string,
  ): Promise<RequestServiceResponse[]> {
    return await this.requestServiceService.getAllByUserId(id);
  }

  @Get('getallbyfixerid/:id')
  async getAllByFixerId(
    @Param('id') id: string,
  ): Promise<RequestServiceResponse[]> {
    return await this.requestServiceService.getAllByFixerId(id);
  }

  @Get('filter')
  async filterPendingOrRejected(
    @Query() filter: FilterRequestServiceDto,
  ): Promise<RequestServiceResponse[]> {
    console.log(filter)
    return this.requestServiceService.getAllPendingOrRejected(filter);
  }

  @Get(':id')
  async getOneByUnit(@Param('id') id: string): Promise<RequestServiceEntity> {
    return this.requestServiceService.getOneById(id);
  }

  @Patch('fixer-approval')
  async fixerApproval(@Body() dto: FixerApprovalDto): Promise<MessageResponse> {
    return this.requestServiceService.fixerReceiveRequest(
      dto.requestId,
      dto.fixerId,
    );
  }

  @Get('approved-service/:fixerId')
  async getApprovedService(@Param('fixerId') fixerId: string) {
    return await this.requestServiceService.getApprovedServiceByFixerId(
      fixerId,
    );
  }

  @Patch('user-cancel/:id')
  async userCancel(@Param('id') id: string): Promise<MessageResponse> {
    return this.requestServiceService.userCancelRequest(id);
  }

  @Patch('fixer-reject/:id')
  async fixerReject(@Param('id') id: string): Promise<MessageResponse> {
    return this.requestServiceService.fixerRejectRequest(id);
  }

  @Get('fixer/:fixerId/stats')
  @ApiOperation({ summary: 'Get request statistics for a fixer' })
  @ApiResponse({
    status: 200,
    description: 'Return total, monthly and weekly request counts for the fixer',
  })
  async getFixerRequestStats(
    @Param('fixerId') fixerId: string,
  ): Promise<{
    total: number;
    thisMonth: number;
    thisWeek: number;
  }> {
    return this.requestServiceService.getFixerRequestStats(fixerId);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateRequestServiceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<MessageResponse> {
    return await this.requestServiceService.updateRequestService(id, body, files);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<MessageResponse> {
    return await this.requestServiceService.deleteRequestService(id);
  }

  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateIconDto: UpdateIconDto,
  // ): Promise<ListDetailServiceEntity> {
  //   return this.requestServiceService.update(id, updateIconDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.requestServiceService.remove(id);
  }
}
