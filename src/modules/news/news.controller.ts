import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { News } from 'src/database/entities/news.entity';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new news article' })
  @ApiResponse({
    status: 201,
    description: 'The news article has been successfully created.',
    type: News,
  })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news articles' })
  @ApiResponse({
    status: 200,
    description: 'Return all news articles.',
    type: [News],
  })
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a news article by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the news article.',
    type: News,
  })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a news article' })
  @ApiResponse({
    status: 200,
    description: 'The news article has been successfully updated.',
    type: News,
  })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a news article' })
  @ApiResponse({
    status: 200,
    description: 'The news article has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
