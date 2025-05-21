import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillFixerEntity } from '../../database/entities/skill-fixer.entity';
import { CreateSkillFixerDto } from './dto/create-skill-fixer.dto';
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

  async update(id: string, updateSkillFixerDto: UpdateSkillFixerDto) {
    await this.skillFixerRepository.update(id, updateSkillFixerDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const skillFixer = await this.findOne(id);
    return this.skillFixerRepository.remove(skillFixer);
  }
} 