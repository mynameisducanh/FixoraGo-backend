import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateRequestConfirmDto } from './dto/create-request-confirm.dto';
import { UpdateRequestConfirmDto } from './dto/update-request-confirm.dto';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';
import {
  RequestConfirmEntity,
  ConfirmStatus,
} from 'src/database/entities/request-confirm.entity';
import { RequestConfirmResponse } from './types/requestConfirm.types';

@Injectable()
export class RequestConfirmService {
  constructor(
    @InjectRepository(RequestConfirmEntity)
    private readonly requestConfirmRes: Repository<RequestConfirmEntity>,
  ) {}

  async save(
    confirm: DeepPartial<RequestConfirmEntity>,
  ): Promise<RequestConfirmEntity> {
    return await this.requestConfirmRes.save(confirm);
  }

  async createRequestConfirm(
    body: CreateRequestConfirmDto,
  ): Promise<MessageResponse> {
    const newConfirm: DeepPartial<RequestConfirmEntity> = {
      userId: body.userId,
      staffId: body.staffId,
      requestServiceId: body.requestServiceId,
      proposedPrice: body.proposedPrice,
      negotiatedPrice: body.negotiatedPrice,
      staffNote: body.staffNote,
      staffVerified: ConfirmStatus.ACCEPTED,
      status: ConfirmStatus.PENDING,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };
    await this.requestConfirmRes.save(newConfirm);
    return {
      message: 'Tạo request confirm thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getOneById(id: string): Promise<RequestConfirmResponse> {
    console.log(id);
    try {
      const queryResult = await this.requestConfirmRes
        .createQueryBuilder('requestConfirms')
        .andWhere('requestConfirms.id = :id', { id: id })
        .addSelect([
          'requestConfirms.id AS id',
          'requestConfirms.userId AS userid',
          'requestConfirms.staffId AS staffid',
          'requestConfirms.requestServiceId AS requestserviceid',
          'requestConfirms.proposedPrice AS proposedprice',
          'requestConfirms.negotiatedPrice AS negotiatedprice',
          'requestConfirms.StaffVerified AS staffverified',
          'requestConfirms.UserVerified AS userverified',
          'requestConfirms.userNote AS usernote',
          'requestConfirms.staffNote AS staffnote',
          'requestConfirms.status AS status',
          'requestConfirms.temp AS temp',
          'requestConfirms.CreateAt AS createat',
          'requestConfirms.UpdateAt AS updateat',
          'requestConfirms.DeleteAt AS deleteat',
        ])
        .getRawOne();

      if (!queryResult) {
        throw new NotFoundException(`Request confirm with ID ${id} not found`);
      }
      console.log(queryResult);

      const item = plainToClass(RequestConfirmResponse, queryResult, {
        excludeExtraneousValues: true,
      });
      console.log(item);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async getByRequestServiceId(
    requestServiceId: string,
  ): Promise<RequestConfirmResponse> {
    try {
      const queryResult = await this.requestConfirmRes
        .createQueryBuilder('requestConfirms')
        .andWhere('requestConfirms.requestServiceId = :requestServiceId', {
          requestServiceId: requestServiceId,
        })
        .addSelect([
          'requestConfirms.id AS id',
          'requestConfirms.userId AS userId',
          'requestConfirms.staffId AS staffId',
          'requestConfirms.requestServiceId AS requestServiceId',
          'requestConfirms.proposedPrice AS proposedPrice',
          'requestConfirms.negotiatedPrice AS negotiatedPrice',
          'requestConfirms.userNote AS userNote',
          'requestConfirms.staffNote AS staffNote',
          'requestConfirms.status AS status',
          'requestConfirms.createAt AS createAt',
          'requestConfirms.updateAt AS updateAt',
          'requestConfirms.confirmedAt AS confirmedAt',
        ])
        .getRawOne();

      if (!queryResult) {
        throw new NotFoundException(
          `Request confirm for service ID ${requestServiceId} not found`,
        );
      }

      return plainToClass(RequestConfirmResponse, queryResult, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateRequestConfirm(
    id: string,
    body: UpdateRequestConfirmDto,
  ): Promise<MessageResponse> {
    try {
      console.log(body)
      const confirm = await this.requestConfirmRes.findOne({
        where: { id: id },
      });

      if (!confirm) {
        throw new NotFoundException(`Request confirm with ID ${id} not found`);
      }
      console.log('Current data:', confirm);

      const updateData: DeepPartial<RequestConfirmEntity> = {
        ...confirm,
        updateAt: new Date().getTime(),
      };

      // Chỉ cập nhật các trường được gửi lên
      if (body.negotiatedPrice !== undefined) {
        updateData.negotiatedPrice = body.negotiatedPrice;
      }
      if (body.userNote !== undefined) {
        updateData.userNote = body.userNote;
      }
      if (body.staffNote !== undefined) {
        updateData.staffNote = body.staffNote;
      }

      // Xử lý xác nhận từ user
      if (body.userVerified !== undefined) {
        console.log(body.userVerified)
        updateData.userVerified = body.userVerified;
        if (body.userVerified === ConfirmStatus.ACCEPTED) {
          // Nếu cả user và staff đã xác nhận thì cập nhật status
          if (confirm.staffVerified === ConfirmStatus.ACCEPTED) {
            updateData.status = ConfirmStatus.ACCEPTED;
          }
        } else if (body.userVerified === ConfirmStatus.REJECTED) {
          updateData.status = ConfirmStatus.REJECTED;
        }
      }


      console.log('Update data:', updateData);
      await this.save(updateData);

      return {
        message: 'Cập nhật request confirm thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
