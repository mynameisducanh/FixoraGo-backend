import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/database/entities/news.entity';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { CloudService } from 'src/helpers/cloud.helper';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsService,CloudService],
  exports: [NewsService],
})
export class NewsModule {}
