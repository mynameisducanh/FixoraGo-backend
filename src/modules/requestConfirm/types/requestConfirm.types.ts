import { ConfirmStatus } from 'src/database/entities/request-confirm.entity';

export class RequestConfirmResponse {
  id: string;
  userId: string;
  staffId: string;
  requestServiceId: string;
  proposedPrice: number;
  negotiatedPrice: number;
  userNote: string;
  staffNote: string;
  status: ConfirmStatus;
  createAt: number;
  updateAt: number;
  confirmedAt: number;
} 