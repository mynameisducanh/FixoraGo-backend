import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FixerService } from './fixer.service';
import { CreateFixerDto } from './dto/create-fixer.dto';
import { UpdateFixerDto } from './dto/update-fixer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('fixer')
@Controller('fixer')
export class FixerController {
  constructor(private readonly fixerService: FixerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fixer' })
  @ApiResponse({ status: 201, description: 'The fixer has been successfully created.' })
  create(@Body() createFixerDto: CreateFixerDto) {
    return this.fixerService.create(createFixerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fixers' })
  @ApiResponse({ status: 200, description: 'Return all fixers.' })
  findAll(@Query() query: any) {
    return this.fixerService.findAll(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a fixer by userId' })
  @ApiResponse({ status: 200, description: 'Return the fixer.' })
  findByUserId(@Param('userId') userId: string) {
    return this.fixerService.findByUserId(userId);
  }

  @Patch('user/:userId')
  @ApiOperation({ summary: 'Update a fixer by userId' })
  @ApiResponse({ status: 200, description: 'The fixer has been successfully updated.' })
  updateByUserId(
    @Param('userId') userId: string,
    @Body() updateFixerDto: UpdateFixerDto,
  ) {
    return this.fixerService.updateByUserId(userId, updateFixerDto);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Delete a fixer by userId' })
  @ApiResponse({ status: 200, description: 'The fixer has been successfully deleted.' })
  removeByUserId(@Param('userId') userId: string) {
    return this.fixerService.removeByUserId(userId);
  }
} 