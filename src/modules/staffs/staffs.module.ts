import { Module, Global } from '@nestjs/common';
import { StaffService } from './staffs.service';
import { StaffController } from './staffs.controller';
import { MailerService } from 'src/helpers/mailer.helper';
import { PasswordService } from 'src/helpers/bcrypt.helper';
import { FixerEntity } from 'src/database/entities/fixer.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([FixerEntity])],
  providers: [StaffService, MailerService, PasswordService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
