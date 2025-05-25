import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from 'src/database/entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CloudService } from 'src/helpers/cloud.helper';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private readonly cloudService: CloudService,
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    file: Express.Multer.File,
  ): Promise<News> {
    let fileUrl;
    if (file) {
      fileUrl = await this.cloudService.uploadFileToCloud(file);
    }
    const news = this.newsRepository.create({
      ...createNewsDto,
      image: fileUrl,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });
    return await this.newsRepository.save(news);
  }

  async findAll(): Promise<News[]> {
    return await this.newsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);

    Object.assign(news, {
      ...updateNewsDto,
      updatedAt: new Date().getTime(),
    });

    return await this.newsRepository.save(news);
  }

  async remove(id: string): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);
  }
}
