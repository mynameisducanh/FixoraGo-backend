import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/users.entity';
import { DeepPartial, Repository } from 'typeorm';

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

  async getOne(id: string): Promise<UsersEntity> {
    const user = await this.userRes.findOne({
      where: { id },
    });
    if (!user) {
        throw new Error(`User ${user} not found`);
      }
    return user;
  }

  async findById(id: string): Promise<UsersEntity> {
    const user = await this.userRes
      .createQueryBuilder('user')
      .where("user.Id = :id", { id })
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
  
}
