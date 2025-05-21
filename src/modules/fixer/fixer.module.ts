import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixerEntity } from '../../database/entities/fixer.entity';
import { FixerController } from './fixer.controller';
import { FixerService } from './fixer.service';

@Module({
  imports: [TypeOrmModule.forFeature([FixerEntity])],
  controllers: [FixerController],
  providers: [FixerService],
  exports: [FixerService],
})
export class FixerModule {} 