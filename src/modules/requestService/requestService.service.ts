import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateRequestServiceDto } from 'src/modules/requestService/dto/create-request-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';
import {
  RequestServiceEntity,
  ServiceStatus,
} from 'src/database/entities/request-service.entity';
import { RequestServiceResponse } from 'src/modules/requestService/types/requestService.types';
import { GetAllRequestServiceDto } from 'src/modules/requestService/dto/get-all-request-service.dto';
import { CloudService } from 'src/helpers/cloud.helper';
import {
  FilterRequestServiceDto,
  TimeSort,
  TimeFilter,
} from './dto/filter-request-service.dto';
import { UsersService } from '../users/users.service';
import { HistoryActiveRequestService } from 'src/modules/historyActiveRequest/historyActiveRequest.service';
import { generateId } from 'src/utils/function';
import { MoreThanOrEqual } from 'typeorm';
import { UpdateRequestServiceDto } from 'src/modules/requestService/dto/update-request-service.dto';

@Injectable()
export class RequestServiceService {
  constructor(
    private readonly cloudService: CloudService,
    @InjectRepository(RequestServiceEntity)
    private readonly requestServiceRes: Repository<RequestServiceEntity>,
    private readonly userService: UsersService,
    private readonly historyActiveRequestService: HistoryActiveRequestService,
  ) {}

  async save(
    service: DeepPartial<RequestServiceEntity>,
  ): Promise<RequestServiceEntity> {
    return await this.requestServiceRes.save(service);
  }
  async updateRequest(
    requestService: DeepPartial<RequestServiceEntity>[],
  ): Promise<void> {
    await this.requestServiceRes.save(requestService);
  }
  async createRequestService(
    body: any,
    files: Express.Multer.File[],
  ): Promise<MessageResponse> {
    let fileUrl;
    if (files && files.length > 0) {
      fileUrl = await this.cloudService.uploadFilesToCloud(files);
    }
    const idCreate = generateId();
    const newFileRecord: DeepPartial<RequestServiceEntity> = {
      id: idCreate,
      userId: body.userId,
      fixerId: null,
      nameService: body.nameService,
      listDetailService: body.listDetailService,
      priceService: body.priceService,
      typeEquipment: body.typeEquipment,
      calender: body.calender,
      address: body.address,
      fileImage: JSON.stringify(fileUrl),
      note: body.note,
      status: ServiceStatus.PENDING,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };
    this.requestServiceRes.save(newFileRecord);
    const dataHistory = {
      requestServiceId: idCreate,
      name: 'Yêu cầu đã được gửi vui lòng chờ phản hồi từ nhân viên',
      type: 'Yêu cầu dịch vụ đã được tạo',
    };
    await this.historyActiveRequestService.create(dataHistory);
    return {
      message: 'Tạo request service thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getAll(): Promise<RequestServiceResponse[]> {
    try {
      const queryResult =
        this.requestServiceRes.createQueryBuilder('requestServices');

      const data = queryResult
        .orderBy('requestServices.UpdateAt', 'ASC')
        .addOrderBy('requestServices.CreateAt', 'ASC')
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userid',
          'requestServices.fixerId AS fixerid',
          'requestServices.CreateAt AS createat',
          'requestServices.UpdateAt AS updateat',
          'requestServices.DeleteAt AS deleteat',
          'requestServices.nameService AS nameservice',
          'requestServices.listDetailService AS listdetailservice',
          'requestServices.priceService AS priceservice',
          'requestServices.typeEquipment AS typeequipment',
          'requestServices.note AS note',
          'requestServices.fileImage AS fileimage',
          'requestServices.address AS address',
          'requestServices.calender AS calender',
          'requestServices.status AS status',
          'requestServices.approvedTime AS approvedTime',
          'requestServices.guaranteeTime AS guaranteeTime',
          'requestServices.temp AS temp',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });

      // Check guarantee status and expired requests
      const services = await this.requestServiceRes.find();
      await this.checkAndUpdateGuaranteeStatusForList(services);
      await this.checkAndUpdateExpiredRequests(services);

      return items;
    } catch (error) {}
  }

  async getAllByUserId(id: string): Promise<RequestServiceResponse[]> {
    try {
      const queryResult = this.requestServiceRes
        .createQueryBuilder('requestServices')
        .where('requestServices.userId = :userId', { userId: id })
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userid',
          'requestServices.fixerId AS fixerid',
          'requestServices.CreateAt AS createat',
          'requestServices.UpdateAt AS updateat',
          'requestServices.DeleteAt AS deleteat',
          'requestServices.nameService AS nameservice',
          'requestServices.listDetailService AS listdetailservice',
          'requestServices.priceService AS priceservice',
          'requestServices.typeEquipment AS typeequipment',
          'requestServices.note AS note',
          'requestServices.fileImage AS fileimage',
          'requestServices.address AS address',
          'requestServices.calender AS calender',
          'requestServices.status AS status',
          'requestServices.approvedTime AS approvedTime',
          'requestServices.guaranteeTime AS guaranteeTime',
          'requestServices.temp AS temp',
        ])
        .orderBy('requestServices.UpdateAt', 'DESC')
        .addOrderBy('requestServices.CreateAt', 'DESC');

      const result = await queryResult.getRawMany();
      const items = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });

      // Check guarantee status and expired requests
      const services = await this.requestServiceRes.find({
        where: { userId: id },
      });
      await this.checkAndUpdateGuaranteeStatusForList(services);
      await this.checkAndUpdateExpiredRequests(services);

      return items;
    } catch (error) {
      throw error;
    }
  }

  async getAllByFixerId(id: string): Promise<RequestServiceResponse[]> {
    try {
      const queryResult =
        this.requestServiceRes.createQueryBuilder('requestServices');

      queryResult.where('requestServices.fixerId = :fixerId', {
        fixerId: id,
      });

      const data = queryResult
        .orderBy('requestServices.UpdateAt', 'ASC')
        .addOrderBy('requestServices.CreateAt', 'ASC')
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userid',
          'requestServices.fixerId AS fixerid',
          'requestServices.CreateAt AS createat',
          'requestServices.UpdateAt AS updateat',
          'requestServices.DeleteAt AS deleteat',
          'requestServices.nameService AS nameservice',
          'requestServices.listDetailService AS listdetailservice',
          'requestServices.priceService AS priceservice',
          'requestServices.typeEquipment AS typeequipment',
          'requestServices.note AS note',
          'requestServices.fileImage AS fileimage',
          'requestServices.address AS address',
          'requestServices.calender AS calender',
          'requestServices.status AS status',
          'requestServices.approvedTime AS approvedTime',
          'requestServices.guaranteeTime AS guaranteeTime',
          'requestServices.temp AS temp',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });

      // Check guarantee status and expired requests
      const services = await this.requestServiceRes.find({
        where: { fixerId: id },
      });
      await this.checkAndUpdateGuaranteeStatusForList(services);
      await this.checkAndUpdateExpiredRequests(services);

      return items;
    } catch (error) {}
  }

  async getAllPendingOrRejected(
    filter: FilterRequestServiceDto,
  ): Promise<RequestServiceResponse[]> {
    const queryBuilder = this.requestServiceRes.createQueryBuilder('requestServices');

    // Base condition: only PENDING status
    queryBuilder.where('requestServices.status = :status', {
      status: ServiceStatus.PENDING,
    });

    // Filter by name service if provided
    if (filter.nameService) {
      queryBuilder.andWhere('requestServices.nameService ILIKE :nameService', {
        nameService: `%${filter.nameService}%`,
      });
    }

    // Filter by districts if provided
    if (filter.districts) {
      const districtList = filter.districts.split(',');
      queryBuilder.andWhere('requestServices.address ILIKE ANY(:districts)', {
        districts: districtList.map(district => `%${district}%`),
      });
    }

    // Filter by time
    if (filter.time && filter.time !== TimeFilter.ALL) {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
      const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
      const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59).getTime();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      switch (filter.time) {
        case TimeFilter.TODAY:
          queryBuilder.andWhere('requestServices.calender BETWEEN :startOfDay AND :endOfDay', {
            startOfDay,
            endOfDay,
          });
          break;
        case TimeFilter.TOMORROW:
          queryBuilder.andWhere('requestServices.calender BETWEEN :startOfTomorrow AND :endOfTomorrow', {
            startOfTomorrow,
            endOfTomorrow,
          });
          break;
        case TimeFilter.THIS_WEEK:
          queryBuilder.andWhere('requestServices.calender >= :startOfWeek', {
            startOfWeek,
          });
          break;
        case TimeFilter.THIS_MONTH:
          queryBuilder.andWhere('requestServices.calender >= :startOfMonth', {
            startOfMonth,
          });
          break;
      }
    }

    // Sort by time
    if (filter.sortTime === TimeSort.NEWEST) {
      queryBuilder.orderBy('requestServices.CreateAt', 'DESC');
    } else if (filter.sortTime === TimeSort.NEAREST) {
      queryBuilder.orderBy('requestServices.CreateAt', 'ASC');
    } else if (filter.sortTime === TimeSort.EXPIRINGSOON) {
      const now = new Date().getTime();
      // Sắp xếp theo thời gian hẹn gần nhất với thời gian hiện tại
      queryBuilder
        .orderBy(`ABS(requestServices.calender - ${now})`, 'ASC')
        .addOrderBy('requestServices.CreateAt', 'DESC');
    } else {
      // Default order
      queryBuilder.orderBy('requestServices.CreateAt', 'DESC');
    }

    // Select all fields
    queryBuilder.addSelect([
      'requestServices.id AS id',
      'requestServices.userId AS userid',
      'requestServices.fixerId AS fixerid',
      'requestServices.CreateAt AS createat',
      'requestServices.UpdateAt AS updateat',
      'requestServices.DeleteAt AS deleteat',
      'requestServices.nameService AS nameservice',
      'requestServices.listDetailService AS listdetailservice',
      'requestServices.priceService AS priceservice',
      'requestServices.typeEquipment AS typeequipment',
      'requestServices.note AS note',
      'requestServices.fileImage AS fileimage',
      'requestServices.address AS address',
      'requestServices.calender AS calender',
      'requestServices.status AS status',
      'requestServices.approvedTime AS approvedTime',
      'requestServices.guaranteeTime AS guaranteeTime',
      'requestServices.temp AS temp',
    ]);

    const result = await queryBuilder.getRawMany();
    const items = plainToClass(RequestServiceResponse, result, {
      excludeExtraneousValues: true,
    });

    // Check guarantee status and expired requests
    const services = await this.requestServiceRes.find({
      where: { status: ServiceStatus.PENDING },
    });
    await this.checkAndUpdateGuaranteeStatusForList(services);
    await this.checkAndUpdateExpiredRequests(services);

    return items;
  }

  async fixerReceiveRequest(
    id: string,
    fixerId: string,
  ): Promise<MessageResponse> {
    const fixer = await this.userService.findById(fixerId);
    if (!fixer) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    const requestService = await this.requestServiceRes.findOne({
      where: { id },
    });
    if (!requestService) {
      throw new NotFoundException('Không tìm thấy request service');
    }

    // Cập nhật thông tin
    requestService.fixerId = fixerId;
    requestService.status = ServiceStatus.APPROVED;
    requestService.approvedTime = new Date().getTime().toString();
    requestService.updateAt = new Date().getTime();
    const dataHistory = {
      requestServiceId: id,
      name: 'Yêu cầu đã được nhận bởi nhân viên',
      type: 'Nhân viên đã nhận yêu cầu',
    };
    await this.historyActiveRequestService.create(dataHistory);
    await this.requestServiceRes.save(requestService);

    return {
      message: 'Fixer nhận request thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getOneById(id: string): Promise<RequestServiceEntity> {
    const service = await this.requestServiceRes.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException(`Request service with ID ${id} not found`);
    }

    // Check guarantee status
    return await this.checkAndUpdateGuaranteeStatus(service);
  }

  async remove(id: number): Promise<void> {
    const result = await this.requestServiceRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }

  async getApprovedServiceByFixerId(fixerId: string): Promise<{
    statusForFixer: string;
    message?: string;
    data?: RequestServiceResponse;
  }> {
    try {
      const queryResult = this.requestServiceRes
        .createQueryBuilder('requestServices')
        .where('requestServices.fixerId = :fixerId', { fixerId })
        .andWhere('requestServices.status = :status', {
          status: ServiceStatus.APPROVED,
        })
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userid',
          'requestServices.fixerId AS fixerid',
          'requestServices.CreateAt AS createat',
          'requestServices.UpdateAt AS updateat',
          'requestServices.DeleteAt AS deleteat',
          'requestServices.nameService AS nameservice',
          'requestServices.listDetailService AS listdetailservice',
          'requestServices.priceService AS priceservice',
          'requestServices.typeEquipment AS typeequipment',
          'requestServices.note AS note',
          'requestServices.fileImage AS fileimage',
          'requestServices.address AS address',
          'requestServices.calender AS calender',
          'requestServices.status AS status',
          'requestServices.approvedTime AS approvedTime',
          'requestServices.guaranteeTime AS guaranteeTime',
          'requestServices.temp AS temp',
        ])
        .orderBy('requestServices.UpdateAt', 'DESC');

      const result = await queryResult.getRawOne();

      if (!result) {
        return {
          statusForFixer: 'fail',
          message: 'No approved service found for this fixer ID.',
        };
      }

      const item = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });

      return {
        statusForFixer: 'success',
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }

  async userCancelRequest(id: string): Promise<MessageResponse> {
    const requestService = await this.requestServiceRes.findOne({
      where: { id },
    });
    if (!requestService) {
      throw new NotFoundException('Không tìm thấy request service');
    }

    // Update status to DELETED and set deleteAt
    requestService.status = ServiceStatus.DELETED;
    requestService.deleteAt = new Date().getTime();
    requestService.updateAt = new Date().getTime();

    const dataHistory = {
      requestServiceId: id,
      name: 'Yêu cầu đã bị hủy bởi người dùng',
      type: 'Người dùng hủy yêu cầu',
    };
    await this.historyActiveRequestService.create(dataHistory);
    await this.requestServiceRes.save(requestService);

    return {
      message: 'Hủy request service thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async fixerRejectRequest(id: string): Promise<MessageResponse> {
    const requestService = await this.requestServiceRes.findOne({
      where: { id },
    });
    if (!requestService) {
      throw new NotFoundException('Không tìm thấy request service');
    }

    // Update status to REJECTED
    requestService.status = ServiceStatus.REJECTED;
    requestService.updateAt = new Date().getTime();

    const dataHistory = {
      requestServiceId: id,
      name: 'Yêu cầu đã bị từ chối bởi nhân viên',
      type: 'Nhân viên từ chối yêu cầu',
    };
    await this.historyActiveRequestService.create(dataHistory);
    await this.requestServiceRes.save(requestService);

    return {
      message: 'Từ chối request service thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getFixerRequestStats(fixerId: string): Promise<{
    total: number;
    thisMonth: number;
    thisWeek: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).getTime();
    const startOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay()),
    ).getTime();

    const [total, thisMonth, thisWeek] = await Promise.all([
      // Total requests
      this.requestServiceRes.count({
        where: { fixerId },
      }),
      // This month's requests
      this.requestServiceRes.count({
        where: {
          fixerId,
          createAt: MoreThanOrEqual(startOfMonth),
        },
      }),
      // This week's requests
      this.requestServiceRes.count({
        where: {
          fixerId,
          createAt: MoreThanOrEqual(startOfWeek),
        },
      }),
    ]);

    return {
      total,
      thisMonth,
      thisWeek,
    };
  }

  async updateRequestService(
    id: string,
    body: UpdateRequestServiceDto,
    files: Express.Multer.File[],
  ): Promise<MessageResponse> {
    try {
      const service = await this.requestServiceRes.findOne({
        where: { id },
      });

      if (!service) {
        throw new NotFoundException(`Request service with ID ${id} not found`);
      }

      const updateData: DeepPartial<RequestServiceEntity> = {
        nameService: body.nameService,
        listDetailService: body.listDetailService
          ? JSON.stringify(body.listDetailService)
          : undefined,
        priceService: body.priceService,
        typeEquipment: body.typeEquipment,
        calender: body.calender,
        address: body.address,
        note: body.note,
        updateAt: new Date().getTime(),
      };

      if (files && files.length > 0) {
        // Delete old files if they exist
        if (service.fileImage) {
          const oldFiles = JSON.parse(service.fileImage);
          for (const fileUrl of oldFiles) {
            await this.cloudService.deleteFileByUrl(fileUrl, 'image');
          }
        }
        // Upload new files
        const fileUrls = await this.cloudService.uploadFilesToCloud(files);
        updateData.fileImage = JSON.stringify(fileUrls);
      }

      await this.requestServiceRes.update(id, updateData);

      const dataHistory = {
        requestServiceId: id,
        name: 'Yêu cầu dịch vụ đã được cập nhật',
        type: 'Cập nhật yêu cầu dịch vụ',
      };
      await this.historyActiveRequestService.create(dataHistory);

      return {
        message: 'Cập nhật request service thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteRequestService(id: string): Promise<MessageResponse> {
    try {
      const service = await this.requestServiceRes.findOne({
        where: { id },
      });

      if (!service) {
        throw new NotFoundException(`Request service with ID ${id} not found`);
      }

      // Delete associated files if they exist
      if (service.fileImage) {
        const files = JSON.parse(service.fileImage);
        for (const fileUrl of files) {
          await this.cloudService.deleteFileByUrl(fileUrl, 'image');
        }
      }

      // Update status to DELETED and set deleteAt
      service.status = ServiceStatus.DELETED;
      service.deleteAt = new Date().getTime();
      service.updateAt = new Date().getTime();
      await this.requestServiceRes.save(service);

      const dataHistory = {
        requestServiceId: id,
        name: 'Yêu cầu dịch vụ đã bị xóa',
        type: 'Xóa yêu cầu dịch vụ',
      };
      await this.historyActiveRequestService.create(dataHistory);

      return {
        message: 'Xóa request service thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateRequestServiceStatus(
    id: string,
    status: ServiceStatus,
    guaranteeTime?: string,
  ): Promise<void> {
    const updateData: DeepPartial<RequestServiceEntity> = {
      status,
      updateAt: new Date().getTime(),
    };

    if (guaranteeTime) {
      updateData.guaranteeTime = guaranteeTime;
    }

    await this.requestServiceRes.update(id, updateData);
  }

  private async checkAndUpdateGuaranteeStatus(
    service: RequestServiceEntity,
  ): Promise<RequestServiceEntity> {
    if (
      service.status === ServiceStatus.GUARANTEE &&
      service.guaranteeTime &&
      parseInt(service.guaranteeTime) < new Date().getTime()
    ) {
      await this.updateRequestServiceStatus(service.id, ServiceStatus.DONE);
      service.status = ServiceStatus.DONE;
    }
    return service;
  }

  private async checkAndUpdateGuaranteeStatusForList(
    services: RequestServiceEntity[],
  ): Promise<RequestServiceEntity[]> {
    const updatedServices = await Promise.all(
      services.map((service) => this.checkAndUpdateGuaranteeStatus(service)),
    );
    return updatedServices;
  }

  private async checkAndUpdateExpiredRequests(
    services: RequestServiceEntity[],
  ): Promise<RequestServiceEntity[]> {
    const now = new Date().getTime();
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        if (
          service.status === ServiceStatus.PENDING &&
          service.calender &&
          parseInt(service.calender) < now
        ) {
          // Cập nhật trạng thái sang REJECTED
          service.status = ServiceStatus.REJECTED;
          service.updateAt = now;
          await this.requestServiceRes.save(service);

          // Tạo lịch sử cho việc từ chối tự động
          const dataHistory = {
            requestServiceId: service.id,
            name: 'Yêu cầu đã bị từ chối do quá hạn',
            type: 'Tự động từ chối yêu cầu',
          };
          await this.historyActiveRequestService.create(dataHistory);
        }
        return service;
      }),
    );
    return updatedServices;
  }
}
