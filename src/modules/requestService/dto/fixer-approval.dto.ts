import { IsUUID } from 'class-validator';

export class FixerApprovalDto {
  @IsUUID()
  requestId: string;

  @IsUUID()
  fixerId: string;
}
