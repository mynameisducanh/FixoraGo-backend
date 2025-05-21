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

  @Get(':id')
  @ApiOperation({ summary: 'Get a fixer by id' })
  @ApiResponse({ status: 200, description: 'Return the fixer.' })
  findOne(@Param('id') id: string) {
    return this.fixerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fixer' })
  @ApiResponse({ status: 200, description: 'The fixer has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateFixerDto: UpdateFixerDto) {
    return this.fixerService.update(id, updateFixerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fixer' })
  @ApiResponse({ status: 200, description: 'The fixer has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.fixerService.remove(id);
  }
} 