import { Controller, Get, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { UserResponse } from "src/modules/users/types/user.types";
import { UsersService } from "src/modules/users/users.service";

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async getMyself(@Req() req: any): Promise<UserResponse> {
    const { userLogged } = req;
    const userData = plainToClass(UserResponse, userLogged, {
      excludeExtraneousValues: true,
    });
    return userData;
  }
}