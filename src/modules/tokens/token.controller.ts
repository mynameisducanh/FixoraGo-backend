import { Controller, Body, Post } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateNewAccessTokenDto } from './dto/create-new-access-token.dto';
import { TokenResponse } from './types/token.types';
import { IsTokenValidDto } from './dto/is-token-valid.dto';

@ApiTags('Token')
@Controller('/token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post('access-token')
  async getNewAccessToken(
    @Body() body: CreateNewAccessTokenDto,
  ): Promise<TokenResponse> {
    return await this.tokenService.createNewAccessToken(body.refreshToken);
  }

  @Post('is-valid')
  async isTokenValid(@Body() body: IsTokenValidDto): Promise<boolean> {
    return await this.tokenService.isTokenValid(body.refreshToken);
  }
}
