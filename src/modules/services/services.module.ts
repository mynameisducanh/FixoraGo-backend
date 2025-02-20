import { Global, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesEntity } from 'src/database/entities/services.entity';
import { ServicesController } from 'src/modules/services/services.controller';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ServicesEntity]),
  ],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class UsersModule {}