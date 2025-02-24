import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Role, timeZoneObj } from 'src/common/constants/enum';
import { CONFIRM_REGISTER, MESSAGE } from 'src/common/constants/message';
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
import { SendEmailDto } from 'src/modules/auth/dto/send-email.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { Login } from 'src/modules/auth/types/login.types';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffService,
    private usersService: UsersService,
    private passwordService: PasswordService,
    private mailService: MailerService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {}
  async login(request: LoginDto): Promise<Login> {
    const user = await this.usersService.findByEmail(
      request.email?.toLocaleLowerCase(),
    );
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
        console.log("vào đây");
        
        throw new NotFoundException(MESSAGE.ACCOUNT_LOGIN_FAILED);
      }

      const payload = {
        userId: user.id,
        email: user.email,
      };

      const { accessToken, refreshToken } = await this.tokenService.createOne(
        payload,
      );

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
      const email = request.email;
      let user = await this.usersService.findByEmail(email);
      if (user) {
        throw new BadRequestException(MESSAGE.EMAIL_EXISTED);
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
        username: email.substring(0, email.indexOf('@')),
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
      const payload = {
        userId: userId,
        email,
      };

      const { accessToken } = await this.tokenService.createOne(payload);
      const confirmUrl = `${this.configService.get<string>(
        'app.client_url',
      )}/verifyEmail?token=${accessToken}`;

      const fullName = `${email.substring(0, email.indexOf('@'))}`;

      const html = CONFIRM_REGISTER("vi",fullName, confirmUrl);

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
      const email = request.email;
      let user = await this.usersService.findByEmail(email);
      if (user) {
        throw new BadRequestException(MESSAGE.EMAIL_EXISTED);
      }
      const password = generateCustomString(12);
      const hashedPassword = this.passwordService.encryptPassword(password);
      const userId = generateId().toLocaleLowerCase();

      const newUser = await this.usersService.save({
        id: userId,
        createAt: new Date().getTime(),
        updateAt: new Date().getTime(),
        deleteAt: 0,
        username: email.substring(0, email.indexOf('@')),
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

  async sendVerifyEmail(
    request: SendEmailDto,
    language: string,
  ): Promise<boolean> {
    try {
      const { email } = request;
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

      const claims = { userId: user.id, email: user.email };

      const { accessToken } = await this.tokenService.createOne(claims);

      const confirmUrl = `${this.configService.get<string>(
        'app.client_url',
      )}/${language}/send-verify-email?token=${accessToken}`;

      const fullName = `${user.firstName} ${user.lastName}`;

      const html = CONFIRM_REGISTER(language, fullName, confirmUrl);

      this.mailService.sendMail(user.email, html.titles, html.content);

      return true;
    } catch (error) {
      throw error;
    }
  }

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
}
