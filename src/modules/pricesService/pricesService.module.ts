import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer from 'multer';
import { PricesServiceEntity } from 'src/database/entities/prices-service.entity';
import { CloudService } from 'src/helpers/cloud.helper';
import { PriceServiceController } from 'src/modules/pricesService/pricesService.controller';
import { PriceServiceService } from 'src/modules/pricesService/pricesService.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PricesServiceEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [PriceServiceService, CloudService],
  controllers: [PriceServiceController],
  exports: [PriceServiceService],
})
export class PriceServiceModule {}
