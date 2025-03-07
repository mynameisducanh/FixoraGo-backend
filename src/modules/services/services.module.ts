import { Global, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesEntity } from 'src/database/entities/services.entity';
import { ServicesController } from 'src/modules/services/services.controller';
import { CloudService } from 'src/helpers/cloud.helper';

@Global()
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ServicesEntity])],
  providers: [ServicesService, CloudService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
