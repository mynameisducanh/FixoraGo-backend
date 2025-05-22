import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillFixerEntity } from '../../database/entities/skill-fixer.entity';
import { CreateSkillFixerDto, CreateMultipleSkillsDto } from './dto/create-skill-fixer.dto';
import { UpdateSkillFixerDto } from './dto/update-skill-fixer.dto';

@Injectable()
export class SkillFixerService {
  constructor(
    @InjectRepository(SkillFixerEntity)
    private skillFixerRepository: Repository<SkillFixerEntity>,
  ) {}

  create(createSkillFixerDto: CreateSkillFixerDto) {
    const skillFixer = this.skillFixerRepository.create(createSkillFixerDto);
    return this.skillFixerRepository.save(skillFixer);
  }

  async createMultipleSkills(createMultipleSkillsDto: CreateMultipleSkillsDto) {
    const { userId, skills } = createMultipleSkillsDto;
    
    // Create an array of skill entities
    const skillEntities = skills.map(skillName => 
      this.skillFixerRepository.create({
        userId,
        name: skillName,
        type: 'skill',
        createAt: new Date().getTime(),
        updateAt: new Date().getTime()
      })
    );

    // Save all skills in a single transaction
    const savedSkills = await this.skillFixerRepository.save(skillEntities);
    return savedSkills;
  }

  findAll(query: any) {
    return this.skillFixerRepository.find({
      where: query,
    });
  }

  findOne(id: string) {
    return this.skillFixerRepository.findOne({
      where: { id },
    });
  }

  async findAllByUserId(userId: string) {
    const skills = await this.skillFixerRepository.find({
      where: { userId },
      order: { createAt: 'DESC' },
    });

    if (!skills || skills.length === 0) {
      throw new NotFoundException(`No skills found for userId ${userId}`);
    }

    return skills;
  }

  async update(id: string, updateSkillFixerDto: UpdateSkillFixerDto) {
    await this.skillFixerRepository.update(id, updateSkillFixerDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const skillFixer = await this.findOne(id);
    return this.skillFixerRepository.remove(skillFixer);
  }
} 