import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MessageResponse } from "src/common/types/response";
import { AuthService } from "src/modules/auth/auth.service";
import { RegisterDto } from "src/modules/auth/dto/register.dto";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('register')
    async register(
      @Body() registerRequest: RegisterDto,
    ): Promise<MessageResponse> {
      return await this.authService.register(
        registerRequest
      );
    }
}