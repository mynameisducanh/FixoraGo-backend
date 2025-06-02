import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/users.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { CloudService } from 'src/helpers/cloud.helper';
import { MessageResponse } from 'src/common/types/response';
import { HttpStatus } from '@nestjs/common';
import { ChatMessage } from 'src/database/entities/chat-message.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from 'src/helpers/bcrypt.helper';
import { v4 as uuidv4 } from 'uuid';
import { CONFIRM_REGISTER_BY_ADMIN } from 'src/common/constants/message';
import { MailerService } from 'src/helpers/mailer.helper';
import { RevenueManagerService } from '../revenue-manager/revenue-manager.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRes: Repository<UsersEntity>,
    private readonly cloudService: CloudService,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailerService,
    private readonly revenueManagerService: RevenueManagerService,
  ) {}

  async save(user: DeepPartial<UsersEntity>): Promise<UsersEntity> {
    return await this.userRes.save(user);
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    const user = await this.userRes.findOne({ where: { email } });
    return user;
  }

  async findByUsername(username: string): Promise<UsersEntity> {
    const user = await this.userRes.findOne({ where: { username } });
    return user;
  }

  async getOne(id: string): Promise<UsersEntity> {
    const user = await this.userRes.findOne({
      where: { id },
    });
    return user;
  }

  async findById(id: string): Promise<UsersEntity> {
    const user = await this.userRes
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .select([
        'user.id as id',
        'user.Username as username',
        'user.FirstName as firstName',
        'user.LastName as lastName',
        'user.Email as email',
        'user.EmailVerified as emailverified',
        'user.PhoneNumber as phoneNumber',
        'user.PhoneVerified as phoneVerified',
        'user.InfoVerified as infoverified',
        'user.Roles as roles',
        'user.Address as address',
        'user.CurrentLocation as currentLocation',
        'user.Status as status',
        'user.CreateAt as createAt',
        'user.LastCheckIn as lastCheckIn',
        'user.AuthData as authData',
      ])
      .getRawOne();

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UsersEntity> {
    const user = await this.getOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Update user fields
    Object.assign(user, {
      ...updateUserDto,
      updateAt: new Date().getTime(),
    });

    return await this.userRes.save(user);
  }

  async updateStatus(id: string, status: number): Promise<UsersEntity> {
    const user = await this.getOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = status;
    user.updateAt = new Date().getTime();

    return await this.userRes.save(user);
  }

  async updateLocation(id: string, location: string): Promise<UsersEntity> {
    const user = await this.getOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.currentLocation = location;
    user.updateAt = new Date().getTime();

    return await this.userRes.save(user);
  }

  async countUsers(): Promise<{ totalUsers: number; monthlyStats: Array<{ month: string; monthlyUserRegister: number }> }> {
    const totalUsers = await this.userRes.count();

    // Lấy thống kê người dùng đăng ký theo tháng trong năm hiện tại
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1).getTime();
    const endDate = new Date(currentYear, 11, 31).getTime();

    const monthlyStats = await this.userRes
      .createQueryBuilder('user')
      .select([
        'EXTRACT(MONTH FROM to_timestamp("CreateAt"/1000)) as month',
        'COUNT(*) as monthlyUserRegister',
      ])
      .where('"CreateAt" BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('EXTRACT(MONTH FROM to_timestamp("CreateAt"/1000))')
      .orderBy('month', 'ASC')
      .getRawMany();

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

    const formattedMonthlyStats = monthNames.map((month, index) => {
      const stat = monthlyStats.find(
        (s) => Math.floor(Number(s.month)) - 1 === index,
      );
      return {
        month,
        monthlyUserRegister: Number(stat?.monthlyuserregister || 0),
      };
    });

    return {
      totalUsers,
      monthlyStats: formattedMonthlyStats,
    };
  }

  async getAllUsers(): Promise<UsersEntity[]> {
    return await this.userRes
      .createQueryBuilder('user')
      .select([
        'user.id as id',
        'user.Username as username',
        'user.FirstName as firstName',
        'user.LastName as lastName',
        'user.Email as email',
        'user.EmailVerified as emailverified',
        'user.PhoneNumber as phoneNumber',
        'user.PhoneVerified as phoneVerified',
        'user.AvatarUrl as avatarurl',
        'user.InfoVerified as infoVerified',
        'user.Roles as roles',
        'user.Address as address',
        'user.CurrentLocation as currentLocation',
        'user.Status as status',
        'user.CreateAt as createAt',
        'user.LastCheckIn as lastCheckIn',
      ])
      .addOrderBy('user.CreateAt', 'DESC')
      .getRawMany();
  }

  async getUserByUserId(userId: string): Promise<UsersEntity> {
    const user = await this.userRes
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .select([
        'user.id as id',
        'user.Username as username',
        'user.FirstName as firstName',
        'user.LastName as lastName',
        'user.Email as email',
        'user.EmailVerified as emailverified',
        'user.PhoneNumber as phoneNumber',
        'user.PhoneVerified as phoneVerified',
        'user.InfoVerified as infoverified',
        'user.Roles as roles',
        'user.Address as address',
        'user.CurrentLocation as currentLocation',
        'user.Status as status',
        'user.LastCheckIn as lastCheckIn',
        'user.AvatarUrl as avatarUrl',
        'user.Gioitinh as gioitinh',
        'user.AuthData as authData',
        'user.createAt as createat',
        'user.updateAt as updateat',
        'user.deleteAt as deleteat',
      ])
      .getRawOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async getUserByUserId2(userId: string): Promise<UsersEntity> {
    const user = await this.userRes.findOne({
      where: { id: userId },
      select: [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'emailVerified',
        'phoneNumber',
        'phoneVerified',
        'infoVerified',
        'roles',
        'address',
        'currentLocation',
        'status',
        'lastCheckIn',
        'avatarUrl',
        'gioitinh',
        'authData',
        'createAt',
        'updateAt',
        'deleteAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateUserProfileDto,
    avatarFile?: Express.Multer.File,
  ): Promise<MessageResponse> {
    const user = await this.getOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: DeepPartial<UsersEntity> = {
      updateAt: new Date().getTime(),
    };

    // Update basic profile information
    if (updateProfileDto.firstName) {
      updateData.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName) {
      updateData.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.phoneNumber) {
      updateData.phoneNumber = updateProfileDto.phoneNumber;
    }
    if (updateProfileDto.address) {
      updateData.address = updateProfileDto.address;
    }
    if (updateProfileDto.gioitinh) {
      updateData.gioitinh = updateProfileDto.gioitinh;
    }

    // Handle avatar upload
    if (avatarFile) {
      if (user.avatarUrl) {
        // Delete old avatar if exists
        await this.cloudService.deleteFileByUrl(user.avatarUrl, 'image');
      }
      const avatarUrl = await this.cloudService.uploadFileToCloud(avatarFile);
      if (avatarUrl) {
        updateData.avatarUrl = avatarUrl;
      }
    }

    await this.userRes.update(userId, updateData);

    return {
      message: 'Profile updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getUserNameById(
    userId: string,
  ): Promise<{ username: string; fullName: string; avatarUrl: string }> {
    const user = await this.userRes
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .select([
        'user.Username as username',
        'user.FirstName as firstname',
        'user.LastName as lastname',
        'user.AvatarUrl as avatarurl',
      ])
      .getRawOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const fullName =
      user.firstname && user.lastname
        ? `${user.firstname} ${user.lastname}`
        : '';
    return {
      username: user.username || '',
      fullName,
      avatarUrl: user.avatarurl || '',
    };
  }

  async updateInfoVerifiedScore(
    userId: string,
    points: number,
    operation: 'add' | 'subtract',
  ): Promise<UsersEntity> {
    const user = await this.getOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate new score based on operation
    let newScore = user.infoVerified;
    if (operation === 'add') {
      newScore = user.infoVerified + points;
    } else {
      newScore = user.infoVerified - points;
    }

    // Ensure score stays within bounds
    newScore = Math.min(Math.max(newScore, 50), 110);

    user.infoVerified = newScore;
    user.updateAt = new Date().getTime();

    return await this.userRes.save(user);
  }

  async checkAndLockLowInfoVerifiedAccount(
    userId: string,
  ): Promise<{ isLocked: boolean; message?: string }> {
    const user = await this.getOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.infoVerified < 50) {
      user.status = 1; // Lock status
      user.updateAt = new Date().getTime();
      await this.userRes.save(user);

      return {
        isLocked: true,
        message: 'Tài khoản đã bị khóa do điểm đánh giá thấp',
      };
    }

    return { isLocked: false };
  }

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    // Check if passwords match
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if email already exists
    const existingEmail = await this.findByEmail(createUserDto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.findByUsername(createUserDto.username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Create new user
    const newUser = this.userRes.create({
      id: uuidv4(),
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      username: createUserDto.username,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      password: this.passwordService.encryptPassword(createUserDto.password),
      roles: createUserDto.roles,
      status: 0, // Active by default
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
      emailVerified: 1,
      phoneVerified: 0,
      infoVerified: 100,
    });
    const fullName = newUser.firstName + ' ' + newUser.lastName;

    const html = CONFIRM_REGISTER_BY_ADMIN(
      'vi',
      fullName,
      newUser.username,
      createUserDto.password,
    );
    this.mailService.sendMail(newUser.email, html.titles, html.content);
    if (createUserDto.roles === 'system_fixer') {
      const createData = {
        userId: newUser.id,
        totalRevenue: 0,
        paidFees: 0,
        unpaidFees: 0,
        status: 'active',
        temp: newUser.id + '_total',
        createAt: new Date().getTime(),
        updateAt: new Date().getTime(),
      };
      await this.revenueManagerService.create(createData);
    }
    return await this.userRes.save(newUser);
  }

  async softDeleteUser(userId: string): Promise<MessageResponse> {
    const user = await this.getOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update deleteAt timestamp
    await this.userRes.update(userId, {
      deleteAt: new Date().getTime(),
      updateAt: new Date().getTime()
    });

    return {
      message: 'User deleted successfully',
      statusCode: HttpStatus.OK
    };
  }
}
