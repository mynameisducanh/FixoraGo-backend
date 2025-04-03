import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/users.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRes: Repository<UsersEntity>,
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
      .where('user.Id = :id', { id })
      .select([
        'user.Id as id',
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
}
