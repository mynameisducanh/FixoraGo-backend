import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffEntity } from 'src/database/entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRes: Repository<StaffEntity>,
  ) {}

  async save(staff: Partial<StaffEntity>): Promise<StaffEntity> {
    return this.staffRes.save(staff);
  }
}
