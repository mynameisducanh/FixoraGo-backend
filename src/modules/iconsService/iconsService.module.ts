import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer from 'multer';
import { IconEntity } from 'src/database/entities/icons.entity';
import { IconServiceEntity } from 'src/database/entities/iconsService.entity';
import { CloudService } from 'src/helpers/cloud.helper';
import { IconsServiceController } from 'src/modules/iconsService/iconsService.controller';
import { IconsServiceService } from 'src/modules/iconsService/iconsService.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([IconServiceEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [IconsServiceService, CloudService],
  controllers: [IconsServiceController],
  exports: [IconsServiceService],
})
export class IconsServiceModule {}
