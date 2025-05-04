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
} from '@nestjs/common';
import { CreateRequestServiceDto } from 'src/modules/requestService/dto/create-request-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { ListDetailServiceResponse } from 'src/modules/listDetailService/types/listDetailService.types';
import { RequestServiceService } from 'src/modules/requestService/requestService.service';
import { RequestServiceResponse } from 'src/modules/requestService/types/requestService.types';
import { GetAllRequestServiceDto } from 'src/modules/requestService/dto/get-all-request-service.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express/multer';
import { ApiConsumes } from '@nestjs/swagger';

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
    console.log(body);
    return await this.requestServiceService.createRequestService(body, files);
  }

  @Get()
  async getAll(): Promise<RequestServiceResponse[]> {
    return await this.requestServiceService.getAll();
  }

  @Get('allbyuserid')
  async getAllByUserId(
    @Body() body: GetAllRequestServiceDto,
  ): Promise<RequestServiceResponse[]> {
    return await this.requestServiceService.getAllByUserId(body);
  }

  @Get(':id')
  async getOneByUnit(@Param('id') id: string): Promise<RequestServiceResponse> {
    return this.requestServiceService.getOneById(id);
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
