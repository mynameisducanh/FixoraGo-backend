import {
  Controller,
  Get,
  Req,
  Patch,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  Post,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { UserResponse } from 'src/modules/users/types/user.types';
import { UsersService } from 'src/modules/users/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { MessageResponse } from 'src/common/types/response';
import { CreateUserDto } from './dto/create-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been created successfully',
    type: UserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email or username already exists',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.userService.create(createUserDto);
    return plainToClass(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total number of users and monthly registration stats' })
  @ApiResponse({
    status: 200,
    description: 'Returns total number of users and monthly registration statistics',
    schema: {
      type: 'object',
      properties: {
        totalUsers: {
          type: 'number',
          description: 'Total number of users in the system',
        },
        monthlyStats: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              month: {
                type: 'string',
                description: 'Month name',
              },
              monthlyUserRegister: {
                type: 'number',
                description: 'Number of users registered in this month',
              },
            },
          },
        },
      },
    },
  })
  async countUsers() {
    return await this.userService.countUsers();
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all users in the system',
    type: [UserResponse],
  })
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userService.getAllUsers();
    return users.map((user) =>
      plainToClass(UserResponse, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('me')
  @JwtAuth()
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

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID',
    type: UserResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserByUserId(
    @Param('userId') userId: string,
  ): Promise<UserResponse> {
    const user = await this.userService.getUserByUserId(userId);
    return plainToClass(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':userId/name')
  @ApiOperation({ summary: 'Get user name and username by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user name and username',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'Username of the user',
        },
        fullName: {
          type: 'string',
          description: 'Full name of the user (firstName + lastName)',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserNameById(
    @Param('userId') userId: string,
  ): Promise<{ username: string; fullName: string }> {
    return await this.userService.getUserNameById(userId);
  }

  @Patch('profile/:userId')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile has been updated successfully',
    type: MessageResponse,
  })
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateUserProfileDto,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ): Promise<MessageResponse> {
    return await this.userService.updateProfile(
      userId,
      updateProfileDto,
      avatarFile,
    );
  }

  @Delete(':userId')
  @JwtAuth()
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User has been soft deleted successfully',
    type: MessageResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async softDeleteUser(
    @Param('userId') userId: string,
  ): Promise<MessageResponse> {
    return await this.userService.softDeleteUser(userId);
  }
}
