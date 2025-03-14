import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer from 'multer';
import { ListDetailServiceEntity } from 'src/database/entities/list-detail-service.entity';
import { ListDetailServiceController } from 'src/modules/listDetailService/listDetailService.controller';
import { ListDetailServiceService } from 'src/modules/listDetailService/listDetailService.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ListDetailServiceEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [ListDetailServiceService],
  controllers: [ListDetailServiceController],
  exports: [ListDetailServiceService],
})
export class ListDetailServiceModule {}
