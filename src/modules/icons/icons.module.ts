import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer from 'multer';
import { IconEntity } from 'src/database/entities/icons.entity';
import { CloudService } from 'src/helpers/cloud.helper';
import { IconsController } from 'src/modules/icons/icons.controller';
import { IconsService } from 'src/modules/icons/icons.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([IconEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [IconsService,CloudService],
  controllers: [IconsController],
  exports: [IconsService],
})
export class IconsModule {}
