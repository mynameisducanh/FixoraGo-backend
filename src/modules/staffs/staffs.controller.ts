import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MessageResponse } from "src/common/types/response";
import { AuthService } from "src/modules/auth/auth.service";
import { RegisterDto } from "src/modules/auth/dto/register.dto";

@Controller('staff')
@ApiTags('Staff')
export class StaffController {
    constructor(private readonly authService: AuthService) {}

}