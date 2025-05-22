import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SkillFixerService } from './skill-fixer.service';
import { CreateSkillFixerDto, CreateMultipleSkillsDto } from './dto/create-skill-fixer.dto';
import { UpdateSkillFixerDto } from './dto/update-skill-fixer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('skill-fixer')
@Controller('skill-fixer')
export class SkillFixerController {
  constructor(private readonly skillFixerService: SkillFixerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill fixer' })
  @ApiResponse({ status: 201, description: 'The skill fixer has been successfully created.' })
  create(@Body() createSkillFixerDto: CreateSkillFixerDto) {
    return this.skillFixerService.create(createSkillFixerDto);
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Create multiple skills for a fixer' })
  @ApiResponse({ status: 201, description: 'The skills have been successfully created.' })
  createMultiple(@Body() createMultipleSkillsDto: CreateMultipleSkillsDto) {
    return this.skillFixerService.createMultipleSkills(createMultipleSkillsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skill fixers' })
  @ApiResponse({ status: 200, description: 'Return all skill fixers.' })
  findAll(@Query() query: any) {
    return this.skillFixerService.findAll(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all skills for a specific user' })
  @ApiResponse({ status: 200, description: 'Return all skills for the specified user.' })
  findAllByUserId(@Param('userId') userId: string) {
    return this.skillFixerService.findAllByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a skill fixer by id' })
  @ApiResponse({ status: 200, description: 'Return the skill fixer.' })
  findOne(@Param('id') id: string) {
    return this.skillFixerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a skill fixer' })
  @ApiResponse({ status: 200, description: 'The skill fixer has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateSkillFixerDto: UpdateSkillFixerDto) {
    return this.skillFixerService.update(id, updateSkillFixerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a skill fixer' })
  @ApiResponse({ status: 200, description: 'The skill fixer has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.skillFixerService.remove(id);
  }
} 