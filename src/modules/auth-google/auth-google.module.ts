import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { UsersEntity } from 'src/database/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from 'src/helpers/mailer.helper';
import { PasswordService } from 'src/helpers/bcrypt.helper';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [AuthGoogleService, MailerService, PasswordService],
  controllers: [AuthGoogleController],
  exports: [AuthGoogleService],
})
export class AuthGoogleModule {}
