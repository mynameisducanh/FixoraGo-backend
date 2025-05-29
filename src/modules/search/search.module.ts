import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { News } from 'src/database/entities/news.entity';
import { ServicesEntity } from 'src/database/entities/services.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News, ServicesEntity])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {} 