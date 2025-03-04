import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MESSAGE } from 'src/common/constants/message';
import { MessageResponse } from 'src/common/types/response';
import { IconEntity } from 'src/database/entities/icons.entity';
import { CloudService } from 'src/helpers/cloud.helper';
import { CreateLottieIconDto } from 'src/modules/icons/dto/create-lottie-icon.dto';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class IconsService {
  constructor(
    private readonly cloudService: CloudService,
    @InjectRepository(IconEntity)
    private readonly iconRes: Repository<IconEntity>,
  ) {}

  async save(icon: Partial<IconEntity>): Promise<IconEntity> {
    return this.iconRes.save(icon);
  }

  async uploadLottieFiles(
    files: Express.Multer.File,
    body: CreateLottieIconDto,
  ): Promise<MessageResponse> {
    console.log(files);
    const fileUrl = await this.cloudService.uploadLottieFilesToCloud(files);
    const newFileRecord: DeepPartial<IconEntity> = {
      name: body.name,
      type: body.type,
      url: fileUrl,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };
    this.iconRes.save(newFileRecord);
    return {
      message: MESSAGE.FILES_UPLOADED_SUCCESS,
      statusCode: HttpStatus.OK,
    };
  }

  async getAllLottieIconService(): Promise<any> {
    return await this.iconRes.find({
      where: { type: 'iconLottieService' },
    });
  }
}
