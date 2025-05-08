import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryActiveRequestEntity } from 'src/database/entities/history-active-request.entity';
import { CreateHistoryActiveRequestDto } from './dto/create-history-active-request.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class HistoryActiveRequestService {
  constructor(
    @InjectRepository(HistoryActiveRequestEntity)
    private readonly historyActiveRequestRes: Repository<HistoryActiveRequestEntity>,
  ) {}

  async create(createDto: CreateHistoryActiveRequestDto): Promise<HistoryActiveRequestEntity> {
    const currentTimestamp = Date.now();
    const history = this.historyActiveRequestRes.create({
      ...createDto,
      createAt: currentTimestamp,
      updateAt: currentTimestamp
    });
    return await this.historyActiveRequestRes.save(history);
  }

  async getByRequestServiceId(requestServiceId: string): Promise<HistoryActiveRequestEntity[]> {
    const histories = await this.historyActiveRequestRes.find({
      where: { requestServiceId },
      order: {
        createAt: 'DESC'
      }
    });

    if (!histories.length) {
      throw new NotFoundException(`No history found for request service ID ${requestServiceId}`);
    }

    return histories;
  }

  async getAll(): Promise<HistoryActiveRequestEntity[]> {
    return await this.historyActiveRequestRes.find({
      order: {
        createAt: 'DESC'
      }
    });
  }

  async getOneById(id: string): Promise<HistoryActiveRequestEntity> {
    const history = await this.historyActiveRequestRes.findOne({
      where: { id }
    });

    if (!history) {
      throw new NotFoundException(`History with ID ${id} not found`);
    }

    return history;
  }

  async delete(id: string): Promise<void> {
    const result = await this.historyActiveRequestRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`History with ID ${id} not found`);
    }
  }
}
