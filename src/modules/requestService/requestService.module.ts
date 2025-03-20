import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer from 'multer';
import { ListDetailServiceEntity } from 'src/database/entities/list-detail-service.entity';
import { RequestServiceEntity } from 'src/database/entities/request-service.entity';
import { ListDetailServiceController } from 'src/modules/listDetailService/listDetailService.controller';
import { ListDetailServiceService } from 'src/modules/listDetailService/listDetailService.service';
import { RequestServiceController } from 'src/modules/requestService/requestService.controller';
import { RequestServiceService } from 'src/modules/requestService/requestService.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([RequestServiceEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [RequestServiceService],
  controllers: [RequestServiceController],
  exports: [RequestServiceService],
})
export class RequestServiceModule {}
