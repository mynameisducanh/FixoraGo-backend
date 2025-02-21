import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, LessThan } from 'typeorm';
import { OtpEntity } from 'src/database/entities/otp.entity';
import { generateId, generateOTP } from 'src/utils/function';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class OtpService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(OtpEntity)
    private readonly otpRes: Repository<OtpEntity>,
  ) {}

  async save(otp: DeepPartial<OtpEntity>): Promise<OtpEntity> {
    return await this.otpRes.save(otp);
  }

  async createOtp(email: string): Promise<OtpEntity> {
    const createOtp = generateOTP();
    const id = generateId().toLocaleLowerCase();

    const otpData = {
      id,
      email,
      otp: createOtp.otp,
      expires: createOtp.expiresAt,
    };

    return await this.save(otpData);
  }

  async findByEmail(email: string): Promise<OtpEntity | null> {
    const otps = await this.otpRes
      .createQueryBuilder('otp')
      .where('otp.Email = :email', { email })
      .orderBy('otp.Expires', 'DESC')
      .select([
        'otp.Id as id',
        'otp.Email as email',
        'otp.Otp as otp',
        'otp.Expires as expires',
      ])
      .getRawOne();
    return otps;
  }

  async otpIsValid(otp: string, email: string): Promise<boolean> {
    const otpDb = await this.findByEmail(email);
    if (!otpDb) {
      throw new BadRequestException('Không tìm thấy OTP!');
    }
    if (otp !== otpDb.otp) {
      throw new BadRequestException('Sai OTP!');
    }

    if (Date.now() > otpDb.expires) {
      console.log('OTP đã hết hạn!');
      await this.deleteOtps(otpDb);
      throw new BadRequestException('OTP đã hết hạn!');

    }
    await this.deleteOtps(otpDb);
    await this.authService.verifyOtp(email);
    console.log('OTP hợp lệ!');
    return true;
  }

  async deleteExpiredOtps(): Promise<void> {
    await this.otpRes.delete({ expires: LessThan(Date.now()) });
  }

  async deleteOtps(otp: OtpEntity): Promise<void> {
    await this.otpRes.remove(otp);
  }
}
