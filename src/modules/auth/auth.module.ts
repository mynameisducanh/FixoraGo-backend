import { Module, Global, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailerService } from 'src/helpers/mailer.helper';
import { PasswordService } from 'src/helpers/bcrypt.helper';
import { OtpService } from 'src/modules/otp/otp.service';
import { OtpModule } from 'src/modules/otp/otp.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [forwardRef(() => OtpModule)],
  providers: [AuthService, MailerService, PasswordService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
