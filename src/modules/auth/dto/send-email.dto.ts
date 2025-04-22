import { IsString } from 'class-validator';

export class SendUsernameDto {
  @IsString()
  username: string;
}
