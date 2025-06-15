import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidOtp } from 'src/modules/otp/dto/valid-otp.dto';
import { OtpService } from 'src/modules/otp/otp.service';

@Controller('otp')
@ApiTags('OTP')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('create')
  async createOtp(@Body('email') email: string) {
    return this.otpService.createOtp(email);
  }

  //   @Get(':otp')
  //   async findByOtp(@Param('otp') otp: string) {
  //     return this.otpService.findByOtp(otp);
  //   }

  @Post('validate')
  async validateOtp(@Body() body: ValidOtp) {
    return this.otpService.otpIsValid(body.otp, body.email);
  }

  @Delete('expired')
  async deleteExpiredOtps() {
    return this.otpService.deleteExpiredOtps();
  }
}
