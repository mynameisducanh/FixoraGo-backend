import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FixerEntity } from '../../database/entities/fixer.entity';
import { CreateFixerDto } from './dto/create-fixer.dto';
import { UpdateFixerDto } from './dto/update-fixer.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FixerService {
  constructor(
    @InjectRepository(FixerEntity)
    private fixerRepository: Repository<FixerEntity>,
  ) {}

  async save(staff: Partial<FixerEntity>): Promise<FixerEntity> {
    return this.fixerRepository.save(staff);
  }

  create(createFixerDto: CreateFixerDto) {
    const fixer = this.fixerRepository.create({
      ...createFixerDto,
      id: uuidv4(),
    });
    return this.fixerRepository.save(fixer);
  }

  findAll(query: any) {
    return this.fixerRepository.find({
      where: query,
    });
  }

  async findByUserId(userId: string) {
    const fixer = await this.fixerRepository.findOne({
      where: { userId },
    });

    if (!fixer) {
      throw new NotFoundException(`Fixer with userId ${userId} not found`);
    }

    return fixer;
  }

  async updateByUserId(userId: string, updateFixerDto: UpdateFixerDto) {
    const fixer = await this.findByUserId(userId);
    await this.fixerRepository.update(fixer.id, updateFixerDto);
    return this.findByUserId(userId);
  }

  async removeByUserId(userId: string) {
    const fixer = await this.findByUserId(userId);
    return this.fixerRepository.remove(fixer);
  }
} 