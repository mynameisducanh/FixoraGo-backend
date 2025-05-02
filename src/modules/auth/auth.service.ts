import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, timeZoneObj } from 'src/common/constants/enum';
import {
  CONFIRM_REGISTER,
  MESSAGE,
  RESET_PASSWORD,
} from 'src/common/constants/message';
import { MessageResponse } from 'src/common/types/response';
import { PasswordService } from 'src/helpers/bcrypt.helper';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { RegisterStaffDto } from 'src/modules/auth/dto/register-staff.dto';
import { StaffService } from 'src/modules/staffs/staffs.service';
import { UsersService } from 'src/modules/users/users.service';
import { generateCustomString, generateId } from 'src/utils/function';
import { MailerService } from 'src/helpers/mailer.helper';
import { TokenService } from 'src/modules/tokens/token.service';
import { ConfigService } from '@nestjs/config';
import { SendUsernameDto } from 'src/modules/auth/dto/send-email.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { Login } from 'src/modules/auth/types/login.types';
import { OtpService } from 'src/modules/otp/otp.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffService,
    private usersService: UsersService,
    private passwordService: PasswordService,
    private mailService: MailerService,
    private tokenService: TokenService,
    private configService: ConfigService,
    @Inject(forwardRef(() => OtpService))
    private otpService: OtpService,
  ) {}

  async login(request: LoginDto): Promise<Login> {
    const user = await this.usersService.findByUsername(request.username);
    try {
      if (!user) {
        throw new NotFoundException(MESSAGE.ACCOUNT_LOGIN_FAILED);
      }

      if (user) {
        if (user.deleteAt > 0) {
          throw new BadRequestException(MESSAGE.ACCOUNT_LOCKED);
        }

        if (user.emailVerified === 0) {
          throw new BadRequestException(MESSAGE.ACCOUNT_INACTIVE);
        }
      }

      if (
        !this.passwordService.comparePassword(request.password, user.password)
      ) {
        throw new NotFoundException(MESSAGE.ACCOUNT_LOGIN_FAILED);
      }

      const payload = {
        userId: user.id,
        email: user.email,
      };

      const { accessToken, refreshToken } =
        await this.tokenService.createOne(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async register(request: RegisterDto): Promise<MessageResponse> {
    try {
      const { email, username } = request;

      // Check if email exists
      let user = await this.usersService.findByEmail(email);
      if (user) {
        throw new BadRequestException(MESSAGE.EMAIL_EXISTED);
      }

      // Check if username exists
      user = await this.usersService.findByUsername(username);
      if (user) {
        throw new BadRequestException('Username already exists');
      }

      const hashedPassword = this.passwordService.encryptPassword(
        request.password,
      );

      const userId = generateId().toLocaleLowerCase();

      await this.usersService.save({
        id: userId,
        createAt: new Date().getTime(),
        updateAt: new Date().getTime(),
        deleteAt: 0,
        username: username,
        password: hashedPassword,
        authData: '',
        authService: '',
        googleId: '',
        facebookId: '',
        email,
        emailVerified: 0,
        phoneVerified: 0,
        infoVerified: 0,
        phoneNumber: '',
        firstName: '',
        lastName: '',
        roles: Role.User,
        lastPasswordUpdate: new Date().getTime(),
        lastPictureUpdate: 0,
        address: '',
        currentLocation: '',
        status: 0,
        lastCheckIn: 0,
        timezone: timeZoneObj,
      });

      const otp = await this.otpService.createOtp(email);
      const fullName = username;

      const html = CONFIRM_REGISTER('vi', fullName, otp.otp);

      this.mailService.sendMail(email, html.titles, html.content);
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ACCOUNT_REGISTER_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async registerStaff(request: RegisterStaffDto): Promise<MessageResponse> {
    try {
      const { email, username } = request;

      // Check if email exists
      let user = await this.usersService.findByEmail(email);
      if (user) {
        throw new BadRequestException(MESSAGE.EMAIL_EXISTED);
      }

      // Check if username exists
      user = await this.usersService.findByUsername(username);
      if (user) {
        throw new BadRequestException('Username already exists');
      }

      const password = generateCustomString(12);
      const hashedPassword = this.passwordService.encryptPassword(password);
      const userId = generateId().toLocaleLowerCase();

      const newUser = await this.usersService.save({
        id: userId,
        createAt: new Date().getTime(),
        updateAt: new Date().getTime(),
        deleteAt: 0,
        username: username,
        password: hashedPassword,
        authData: '',
        authService: '',
        email,
        emailVerified: 1,
        phoneVerified: 0,
        infoVerified: 0,
        phoneNumber: '',
        firstName: request.firstName,
        lastName: request.lastName,
        roles: Role.Staff,
        lastPasswordUpdate: new Date().getTime(),
        lastPictureUpdate: 0,
        address: '',
        currentLocation: '',
        status: 0,
        lastCheckIn: 0,
        timezone: timeZoneObj,
      });

      await this.staffService.save({
        userId: newUser,
        employeeCode: request.employeeCode,
        position: request.position,
      });

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ACCOUNT_REGISTER_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  // async sendVerifyEmail(
  //   request: SendEmailDto,
  //   language: string,
  // ): Promise<boolean> {
  //   try {
  //     const { email } = request;
  //     const user = await this.usersService.findByEmail(email);

  //     if (!user) {
  //       throw new NotFoundException(MESSAGE.ACCOUNT_NOT_EXISTED);
  //     }

  //     if (user.deleteAt > 0) {
  //       throw new BadRequestException(MESSAGE.ACCOUNT_LOCKED);
  //     }

  //     if (user.emailVerified === 1) {
  //       throw new BadRequestException(MESSAGE.ACCOUNT_CONFIRMED);
  //     }

  //     const claims = { userId: user.id, email: user.email };

  //     const { accessToken } = await this.tokenService.createOne(claims);

  //     const confirmUrl = `${this.configService.get<string>(
  //       'app.client_url',
  //     )}/${language}/send-verify-email?token=${accessToken}`;

  //     const fullName = `${user.firstName} ${user.lastName}`;

  //     const html = CONFIRM_REGISTER(language, fullName, confirmUrl);

  //     this.mailService.sendMail(user.email, html.titles, html.content);

  //     return true;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async verifyEmail(token: string, language: string): Promise<boolean> {
    try {
      const tokenData = await this.tokenService.validateToken(token);

      if (!tokenData) {
        throw new BadRequestException(MESSAGE.INVALID_OR_EXPIRED_TOKEN);
      }

      const user = await this.usersService.findByEmail(tokenData.email);

      if (!user) {
        throw new NotFoundException(MESSAGE.ACCOUNT_NOT_EXISTED);
      }

      if (user.deleteAt > 0) {
        throw new BadRequestException(MESSAGE.ACCOUNT_LOCKED);
      }

      if (user.emailVerified === 1) {
        await this.tokenService.delete(tokenData.tokenId);
        throw new BadRequestException(MESSAGE.ACCOUNT_CONFIRMED);
      }

      if (user.emailVerified === 0) {
        user.emailVerified = 1;
        user.updateAt = new Date().getTime();
        const result = await this.usersService.save(user);

        if (!result) {
          throw new BadRequestException(MESSAGE.ACCOUNT_VERIFY_FAILED);
        }
      }

      await this.tokenService.delete(tokenData.tokenId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(email: string): Promise<boolean> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException(MESSAGE.ACCOUNT_NOT_EXISTED);
      }

      if (user.deleteAt > 0) {
        throw new BadRequestException(MESSAGE.ACCOUNT_LOCKED);
      }

      if (user.emailVerified === 1) {
        throw new BadRequestException(MESSAGE.ACCOUNT_CONFIRMED);
      }

      if (user.emailVerified === 0) {
        user.emailVerified = 1;
        user.updateAt = new Date().getTime();
        const result = await this.usersService.save(user);

        if (!result) {
          throw new BadRequestException(MESSAGE.ACCOUNT_VERIFY_FAILED);
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendResetPasswordByUsername(request: SendUsernameDto): Promise<any> {
    try {
      const { username } = request;
      const user = await this.usersService.findByUsername(username);

      if (!user) {
        throw new BadRequestException('Không tồn tài tài khoản này');
      }

      if (user.deleteAt > 0) {
        throw new BadRequestException(MESSAGE.ACCOUNT_LOCKED);
      }

      if (user.emailVerified === 0) {
        throw new BadRequestException(MESSAGE.ACCOUNT_NOT_ACTIVATED);
      }

      await this.otpService.createOtp(user.email);
      const otp = await this.otpService.createOtp(user.email);
      const fullName = username;

      const html = RESET_PASSWORD('vi', fullName, otp.otp);

      this.mailService.sendMail(user.email, html.titles, html.content);
      return {
        statusCode: HttpStatus.OK,
        email: user.email,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyOtpResetPassword(otp: string, email: string): Promise<any> {
    try {
      const otpDb = await this.otpService.findByEmail(email);
      const user = await this.usersService.findByEmail(email);
      if (!otpDb) {
        throw new BadRequestException('Không tìm thấy OTP!');
      }
      if (otp !== otpDb.otp) {
        throw new BadRequestException('Sai OTP!');
      }

      if (Date.now() > otpDb.expires) {
        console.log('OTP đã hết hạn!');
        await this.otpService.deleteOtps(otpDb);
        throw new BadRequestException('OTP đã hết hạn!');
      }
      await this.otpService.deleteOtps(otpDb);
      const claims = { userId: user.id, email: user.email };

      const { accessToken } = await this.tokenService.createOne(claims);
      return {
        statusCode: HttpStatus.OK,
        token: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(request: ResetPasswordDto): Promise<boolean> {
    try {
      const { password, token } = request;
      const tokenData = await this.tokenService.validateToken(token);

      if (!tokenData) {
        throw new UnauthorizedException(MESSAGE.INVALID_OR_EXPIRED_TOKEN);
      }

      const user = await this.usersService.findByEmail(tokenData.email);

      if (user.deleteAt > 0) {
        throw new BadRequestException(MESSAGE.ACCOUNT_LOCKED);
      }

      if (!user) {
        throw new NotFoundException(MESSAGE.ACCOUNT_NOT_EXISTED);
      }

      if (user.emailVerified === 0) {
        throw new BadRequestException(MESSAGE.ACCOUNT_NOT_ACTIVATED);
      }

      const hashedPassword = this.passwordService.encryptPassword(password);
      user.password = hashedPassword;
      user.lastPasswordUpdate = new Date().getTime();
      const result = await this.usersService.save(user);

      if (!result) {
        throw new BadRequestException(MESSAGE.ACCOUNT_RESET_PASSWORD_FAILED);
      }

      this.tokenService.delete(tokenData.tokenId);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    request: ChangePasswordDto,
    userPayload: JwtPayload,
  ): Promise<MessageResponse> {
    try {
      const { currentPassword, newPassword } = request;
      const user = await this.usersService.findByEmail(userPayload.email);

      if (!user) {
        throw new NotFoundException(MESSAGE.ACCOUNT_NOT_EXISTED);
      }

      if (user.deleteAt > 0) {
        throw new BadRequestException(MESSAGE.ACCOUNT_LOCKED);
      }

      if (user.emailVerified === 0) {
        throw new BadRequestException(MESSAGE.ACCOUNT_NOT_ACTIVATED);
      }

      if (
        !this.passwordService.comparePassword(currentPassword, user.password)
      ) {
        throw new BadRequestException(MESSAGE.ACCOUNT_INCORRECT_PASSWORD);
      }

      const hashedPassword = this.passwordService.encryptPassword(newPassword);
      user.password = hashedPassword;
      user.lastPasswordUpdate = new Date().getTime();
      const result = await this.usersService.save(user);

      if (!result) {
        throw new BadRequestException(MESSAGE.ACCOUNT_CHANGE_PASSWORD_FAILED);
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ACCOUNT_CHANGE_PASSWORD_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
