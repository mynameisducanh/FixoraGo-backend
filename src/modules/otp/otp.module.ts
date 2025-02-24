import { forwardRef, Global, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from 'src/database/entities/otp.entity';
import { OtpController } from 'src/modules/otp/otp.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([OtpEntity]),
    forwardRef(() => AuthModule)
  ],
  providers: [OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}