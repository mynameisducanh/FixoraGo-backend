import { Controller, Get, Req, Patch, Body, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { UserResponse } from 'src/modules/users/types/user.types';
import { UsersService } from 'src/modules/users/users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@JwtAuth()
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({
    status: 200,
    description: 'User information has been updated successfully',
    type: UserResponse,
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return plainToClass(UserResponse, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({
    status: 200,
    description: 'User status has been updated successfully',
    type: UserResponse,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: number,
  ): Promise<UserResponse> {
    const updatedUser = await this.userService.updateStatus(id, status);
    return plainToClass(UserResponse, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id/location')
  @ApiOperation({ summary: 'Update user location' })
  @ApiResponse({
    status: 200,
    description: 'User location has been updated successfully',
    type: UserResponse,
  })
  async updateLocation(
    @Param('id') id: string,
    @Body('location') location: string,
  ): Promise<UserResponse> {
    const updatedUser = await this.userService.updateLocation(id, location);
    return plainToClass(UserResponse, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
