import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MessageResponse } from "src/common/types/response";
import { Language } from "src/common/decorators/language.decorator";
import { AuthService } from "src/modules/auth/auth.service";
import { ConfirmRegisterDto } from "src/modules/auth/dto/confirm-email.dto";
import { LoginDto } from "src/modules/auth/dto/login.dto";
import { RegisterDto } from "src/modules/auth/dto/register.dto";
import { SendEmailDto } from "src/modules/auth/dto/send-email.dto";
import { Login } from "src/modules/auth/types/login.types";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('login')
    async login(@Body() loginRequest: LoginDto): Promise<Login> {
      return await this.authService.login(loginRequest);
    }
    
    @Post('register')
    async register(
      @Body() registerRequest: RegisterDto,
    ): Promise<MessageResponse> {
      return await this.authService.register(
        registerRequest
      );
    }

    @Post('send-verify-email')
    async sendVerifyEmail(
      @Body() request: SendEmailDto,
      @Language() language: string,
    ): Promise<boolean> {
      return await this.authService.sendVerifyEmail(request, language);
    }

    @Post('verify-email')
    async verifyEmail(
      @Body() tokenObj: ConfirmRegisterDto,
      @Language() language: string,
    ): Promise<boolean> {
      return await this.authService.verifyEmail(tokenObj.token, language);
    }
}