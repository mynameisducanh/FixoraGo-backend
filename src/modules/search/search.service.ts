import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { News } from 'src/database/entities/news.entity';
import { ServicesEntity } from 'src/database/entities/services.entity';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(ServicesEntity)
    private servicesRepository: Repository<ServicesEntity>,
  ) {}

  async search(searchDto: SearchDto) {
    const { query, type } = searchDto;
    const results = {
      news: [],
      services: [],
    };

    if (!type || type === 'news') {
      const newsResults = await this.newsRepository.find({
        where: [
          { title: Like(`%${query}%`) },
          { content: Like(`%${query}%`) },
          { description: Like(`%${query}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
      results.news = newsResults;
    }

    if (!type || type === 'service') {
      const serviceResults = await this.servicesRepository.find({
        where: [
          { name: Like(`%${query}%`) },
          { description: Like(`%${query}%`) },
        ],
        order: { totalViews: 'DESC' },
      });
      results.services = serviceResults;
    }

    return results;
  }
} 