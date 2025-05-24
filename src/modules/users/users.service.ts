import {
  Injectable,
  NotFoundException,
  BadRequestException,
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRes: Repository<UsersEntity>,
    private readonly cloudService: CloudService,
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
        'user.EmailVerified as emailVerified',
        'user.PhoneNumber as phoneNumber',
        'user.PhoneVerified as phoneVerified',
        'user.InfoVerified as infoVerified',
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

  async countUsers(): Promise<number> {
    return await this.userRes.count();
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
        'user.EmailVerified as emailVerified',
        'user.PhoneNumber as phoneNumber',
        'user.PhoneVerified as phoneVerified',
        'user.InfoVerified as infoVerified',
        'user.Roles as roles',
        'user.Address as address',
        'user.CurrentLocation as currentLocation',
        'user.Status as status',
        'user.CreateAt as createAt',
        'user.LastCheckIn as lastCheckIn',
      ])
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
        'user.EmailVerified as emailVerified',
        'user.PhoneNumber as phoneNumber',
        'user.PhoneVerified as phoneVerified',
        'user.InfoVerified as infoVerified',
        'user.Roles as roles',
        'user.Address as address',
        'user.CurrentLocation as currentLocation',
        'user.Status as status',
        'user.LastCheckIn as lastCheckIn',
        'user.AvatarUrl as avatarurl',
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

  async getMessagesByRoom(roomId: string): Promise<ChatMessage[]> {
    return this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }

  async getUserNameById(userId: string): Promise<{ username: string; fullName: string }> {
    const user = await this.userRes
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .select([
        'user.Username as username',
        'user.FirstName as firstName',
        'user.LastName as lastName',
      ])
      .getRawOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const fullName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : '';

    return {
      username: user.username || '',
      fullName,
    };
  }
}
