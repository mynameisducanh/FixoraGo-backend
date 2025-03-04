import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ValidOtp } from 'src/modules/otp/dto/valid-otp.dto';
import { OtpService } from 'src/modules/otp/otp.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express/multer';
import { IconsService } from 'src/modules/icons/icons.service';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateLottieIconDto } from 'src/modules/icons/dto/create-lottie-icon.dto';

@Controller('icons')
export class IconsController {
  constructor(private iconsService: IconsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data; charset=UTF-8')
  async uploadLottieFiles(
    @UploadedFile() file :Express.Multer.File,
    @Body() body : CreateLottieIconDto
  ): Promise<any> {
    console.log("đã nhận file");
    return await this.iconsService.uploadLottieFiles(file,body);
  }

  @Get("lottieIcon")
  async getAllLottieIconService(): Promise<any> {
    return await this.iconsService.getAllLottieIconService();
  }
}
