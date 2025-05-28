import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/users.entity';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { PasswordService } from 'src/helpers/bcrypt.helper';
import { MailerService } from 'src/helpers/mailer.helper';
import { ConfigModule } from '@nestjs/config';
import { CloudService } from 'src/helpers/cloud.helper';
import { RevenueManagerModule } from '../revenue-manager/revenue-manager.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UsersEntity]),
    forwardRef(() => RevenueManagerModule),
  ],
  providers: [UsersService, PasswordService, MailerService, CloudService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
