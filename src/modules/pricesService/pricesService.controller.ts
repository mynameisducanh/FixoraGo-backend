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
} from '@nestjs/common';
import { MessageResponse } from 'src/common/types/response';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiConsumes } from '@nestjs/swagger';
import { CreatePricesServiceDto } from 'src/modules/pricesService/dto/create-icon-service.dto';
import { PriceServiceService } from 'src/modules/pricesService/pricesService.service';
import { PriceServiceResponse } from 'src/modules/pricesService/types/priceService.types';
import { PricesServiceEntity } from 'src/database/entities/prices-service.entity';

@Controller('pricesService')
export class PriceServiceController {
  constructor(private readonly pricesService: PriceServiceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data; charset=UTF-8')
  async create(
    @Body() body: CreatePricesServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponse> {
    return await this.pricesService.createPricesService(file, body);
  }

  @Get()
  async getAll(): Promise<PriceServiceResponse[]> {
    return await this.pricesService.getAll();
  }

  @Get(':unitService')
  async findOne(
    @Param('unitService') unitService: string,
  ): Promise<PriceServiceResponse[]> {
    return this.pricesService.getAllByUnitService(unitService);
  }

  @Get('detail/:id')
  async getOne(@Param('id') id: string): Promise<PricesServiceEntity> {
    return await this.pricesService.getOne(id);
  }
  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateIconDto: UpdateIconDto,
  // ): Promise<IconServiceEntity> {
  //   return this.pricesService.update(id, updateIconDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.pricesService.remove(id);
  }
}
