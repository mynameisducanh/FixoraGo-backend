import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/types/response';
import { Language } from 'src/common/decorators/language.decorator';
import { AuthService } from 'src/modules/auth/auth.service';
import { ConfirmRegisterDto } from 'src/modules/auth/dto/confirm-email.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { SendUsernameDto } from 'src/modules/auth/dto/send-email.dto';
import { Login } from 'src/modules/auth/types/login.types';
import { VerifyOtpDto } from 'src/modules/auth/dto/verify-otp.dto';
import { VerifyOtpResetDto } from './dto/verify-otp-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/common/decorators/current-user.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginDto): Promise<Login> {
    console.log(loginRequest);
    return await this.authService.login(loginRequest);
  }

  @Post('register')
  async register(
    @Body() registerRequest: RegisterDto,
  ): Promise<MessageResponse> {
    return await this.authService.register(registerRequest);
  }

  // @Post('send-verify-email')
  // async sendVerifyEmail(
  //   @Body() request: SendEmailDto,
  //   @Language() language: string,
  // ): Promise<boolean> {
  //   return await this.authService.sendVerifyEmail(request, language);
  // }

  @Post('verify-email')
  async verifyEmail(
    @Body() tokenObj: ConfirmRegisterDto,
    @Language() language: string,
  ): Promise<boolean> {
    return await this.authService.verifyEmail(tokenObj.token, language);
  }

  @Post('reset-password')
  async resetPassword(@Body() username: SendUsernameDto): Promise<boolean> {
    return await this.authService.sendResetPasswordByUsername(username);
  }

  @Post('verify-otp-reset')
  async verifyOtp(@Body() verifyOTP: VerifyOtpResetDto): Promise<boolean> {
    return await this.authService.verifyOtpResetPassword(
      verifyOTP.otp,
      verifyOTP.email,
    );
  }

  @Post('confirm-reset-password')
  async resetPasswordConfirm(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @JwtAuth()
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordDto,
    @User() user: JwtPayload,
  ): Promise<MessageResponse> {
    return await this.authService.changePassword(changePasswordRequest, user);
  }
}
