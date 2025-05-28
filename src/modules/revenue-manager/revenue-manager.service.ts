import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { RevenueManagerEntity } from 'src/database/entities/revenue-manager.entity';
import { CreateRevenueManagerDto } from './dto/create-revenue-manager.dto';
import { UpdateRevenueManagerDto } from './dto/update-revenue-manager.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RevenueManagerService {
  constructor(
    @InjectRepository(RevenueManagerEntity)
    private readonly revenueManagerRepository: Repository<RevenueManagerEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async save(
    service: DeepPartial<RevenueManagerEntity>,
  ): Promise<RevenueManagerEntity> {
    return await this.revenueManagerRepository.save(service);
  }

  async create(
    createDto: CreateRevenueManagerDto,
  ): Promise<RevenueManagerEntity> {
    const revenueManager = this.revenueManagerRepository.create({
      ...createDto,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    });
    return await this.revenueManagerRepository.save(revenueManager);
  }

  async findAll(): Promise<RevenueManagerEntity[]> {
    return await this.revenueManagerRepository.find();
  }

  async findOne(id: string): Promise<RevenueManagerEntity> {
    const revenueManager = await this.revenueManagerRepository.findOne({
      where: { id },
    });
    if (!revenueManager) {
      throw new NotFoundException(`RevenueManager with ID ${id} not found`);
    }
    return revenueManager;
  }

  async update(
    id: string,
    updateDto: UpdateRevenueManagerDto,
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findOne(id);
    Object.assign(revenueManager, updateDto);
    return await this.revenueManagerRepository.save(revenueManager);
  }

  async remove(id: string): Promise<void> {
    const result = await this.revenueManagerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RevenueManager with ID ${id} not found`);
    }
  }

  // Các phương thức cập nhật tài chính
  async updateTotalRevenue(
    id: string,
    amount: number,
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findOne(id);
    revenueManager.totalRevenue = amount;
    return await this.revenueManagerRepository.save(revenueManager);
  }

  async updatePaidFees(
    id: string,
    amount: number,
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findOne(id);
    revenueManager.paidFees = amount;
    return await this.revenueManagerRepository.save(revenueManager);
  }

  async updateUnpaidFees(
    id: string,
    amount: number,
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findOne(id);
    revenueManager.unpaidFees = amount;
    return await this.revenueManagerRepository.save(revenueManager);
  }

  // Phương thức cập nhật tất cả các trường tài chính
  async updateFinancialInfo(
    id: string,
    totalRevenue: number,
    paidFees: number,
    unpaidFees: number,
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findOne(id);
    revenueManager.totalRevenue = totalRevenue;
    revenueManager.paidFees = paidFees;
    revenueManager.unpaidFees = unpaidFees;
    return await this.revenueManagerRepository.save(revenueManager);
  }

  // Các phương thức cập nhật tài chính mới
  async findByUserId(userId: string): Promise<RevenueManagerEntity> {
    const revenueManager = await this.revenueManagerRepository.findOne({
      where: { userId },
    });
    if (!revenueManager) {
      throw new NotFoundException(
        `RevenueManager with userId ${userId} not found`,
      );
    }
    return revenueManager;
  }

  async findByTemp(temp: string): Promise<RevenueManagerEntity> {
    const revenueManager = await this.revenueManagerRepository.findOne({
      where: { temp },
    });
    if (!revenueManager) {
      throw new NotFoundException(`RevenueManager with temp ${temp} not found`);
    }
    return revenueManager;
  }

  async incrementTotalRevenue(
    temp: string,
    amount: number,
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findByTemp(temp);
    console.log(revenueManager);
    revenueManager.totalRevenue = Number(revenueManager.totalRevenue) + amount;
    return await this.revenueManagerRepository.save(revenueManager);
  }

  async updatePaidFeesWithOperation(
    temp: string,
    amount: number,
    operation: 'add' | 'subtract',
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findByTemp(temp);
    const currentAmount = Number(revenueManager.paidFees);
    revenueManager.paidFees =
      operation === 'add' ? currentAmount + amount : currentAmount - amount;
    return await this.revenueManagerRepository.save(revenueManager);
  }

  async updateUnpaidFeesWithOperation(
    temp: string,
    amount: number,
    operation: 'add' | 'subtract',
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findByTemp(temp);
    const currentAmount = Number(revenueManager.unpaidFees);
    revenueManager.unpaidFees =
      operation === 'add' ? currentAmount + amount : currentAmount - amount;
    return await this.revenueManagerRepository.save(revenueManager);
  }

  // Các hàm thống kê theo tháng
  async getYearlyRevenueStatistics(year: number) {
    const startDate = new Date(year, 0, 1).getTime();
    const endDate = new Date(year, 11, 31).getTime();

    // Thống kê doanh thu (temp = 'bill')
    const monthlyRevenueStats = await this.revenueManagerRepository
      .createQueryBuilder('rm')
      .select([
        'EXTRACT(MONTH FROM to_timestamp(rm."CreateAt"/1000)) as month',
        'COALESCE(SUM(rm.totalRevenue), 0) as totalrevenue',
      ])
      .where('rm."CreateAt" BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('rm.status = :status', { status: 'active' })
      .groupBy('EXTRACT(MONTH FROM to_timestamp(rm."CreateAt"/1000))')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Thống kê phí thu được (temp = 'staff_payfee')
    const monthlyFeeStats = await this.revenueManagerRepository
      .createQueryBuilder('rm')
      .select([
        'EXTRACT(MONTH FROM to_timestamp(rm."CreateAt"/1000)) as month',
        'COALESCE(SUM(rm.paidFees), 0) as paidfees',
      ])
      .where('rm."CreateAt" BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('rm.status = :status', { status: 'active' })
      .groupBy('EXTRACT(MONTH FROM to_timestamp(rm."CreateAt"/1000))')
      .orderBy('month', 'ASC')
      .getRawMany();


    const monthlyUnpaidFeeStats = await this.revenueManagerRepository
      .createQueryBuilder('rm')
      .select([
        'EXTRACT(MONTH FROM to_timestamp(rm."CreateAt"/1000)) as month',
        'COALESCE(SUM(rm.unpaidFees), 0) as unpaidfees',
      ])
      .where('rm."CreateAt" BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('rm.status = :status', { status: 'active' })
      .groupBy('EXTRACT(MONTH FROM to_timestamp(rm."CreateAt"/1000))')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Tính tổng doanh thu trong năm
    const yearlyTotalRevenue = monthlyRevenueStats.reduce(
      (sum, month) => sum + Number(month.totalrevenue || 0),
      0,
    );

    // Tính tổng phí thu được trong năm
    const yearlyTotalFees = monthlyFeeStats.reduce(
      (sum, month) => sum + Number(month.paidfees || 0),
      0,
    );

    // Tính tổng phí chưa nộp trong năm
    const yearlyTotalUnpaidFees = monthlyUnpaidFeeStats.reduce(
      (sum, month) => sum + Number(month.unpaidfees || 0),
      0,
    );

    // Chuyển đổi dữ liệu theo format yêu cầu
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Tạo mảng kết quả theo format mới
    const monthlyStats = monthNames.map((month, index) => {
      const revenueStat = monthlyRevenueStats.find(
        (stat) => Math.floor(Number(stat.month)) - 1 === index,
      );
      const feeStat = monthlyFeeStats.find(
        (stat) => Math.floor(Number(stat.month)) - 1 === index,
      );

      return {
        month,
        monthlyRevenue: Number(revenueStat?.totalrevenue || 0),
        monthlyFees: Number(feeStat?.paidfees || 0),
      };
    });

    return {
      yearlyTotalRevenue,
      yearlyTotalFees,
      yearlyTotalUnpaidFees,
      monthlyStats,
    };
  }

  async getCurrentYearRevenueStatistics() {
    const now = new Date();
    return this.getYearlyRevenueStatistics(now.getFullYear());
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<RevenueManagerEntity> {
    const revenueManager = await this.findOne(id);
    revenueManager.status = status;
    revenueManager.updateAt = new Date().getTime();
    return await this.revenueManagerRepository.save(revenueManager);
  }

  async getAllBills() {
    const bills = await this.revenueManagerRepository
      .createQueryBuilder('rm')
      .where('rm.temp = :temp', { temp: 'bill' })
      .andWhere('rm.status = :status', { status: 'active' })
      .orderBy('rm."CreateAt"', 'DESC')
      .getMany();

    // Lấy thông tin user cho mỗi bill
    const billsWithUserInfo = await Promise.all(
      bills.map(async (bill) => {
        const userInfo = await this.usersService.getUserByUserId2(bill.userId);
        return {
          ...bill,
          user: {
            fullName: `${userInfo.firstName} ${userInfo.lastName}`,
            username: userInfo.username,
            email: userInfo.email,
            avatarUrl: userInfo.avatarUrl,
          },
        };
      }),
    );

    return billsWithUserInfo;
  }
}
