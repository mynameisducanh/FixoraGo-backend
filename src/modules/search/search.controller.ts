import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search for news and services' })
  @ApiResponse({
    status: 200,
    description: 'Returns search results for news and services',
  })
  async search(@Query() searchDto: SearchDto) {
    return await this.searchService.search(searchDto);
  }
} 