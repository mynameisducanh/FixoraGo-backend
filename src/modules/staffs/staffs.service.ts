import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FixerEntity } from 'src/database/entities/fixer.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(FixerEntity)
    private readonly staffRes: Repository<FixerEntity>,
  ) {}

  async save(staff: Partial<FixerEntity>): Promise<FixerEntity> {
    return this.staffRes.save(staff);
  }
}
