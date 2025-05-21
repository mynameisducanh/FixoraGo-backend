import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FixerEntity } from '../../database/entities/fixer.entity';
import { CreateFixerDto } from './dto/create-fixer.dto';
import { UpdateFixerDto } from './dto/update-fixer.dto';

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
    const fixer = this.fixerRepository.create(createFixerDto);
    return this.fixerRepository.save(fixer);
  }

  findAll(query: any) {
    return this.fixerRepository.find({
      where: query,
    });
  }

  findOne(id: string) {
    return this.fixerRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateFixerDto: UpdateFixerDto) {
    await this.fixerRepository.update(id, updateFixerDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const fixer = await this.findOne(id);
    return this.fixerRepository.remove(fixer);
  }
} 