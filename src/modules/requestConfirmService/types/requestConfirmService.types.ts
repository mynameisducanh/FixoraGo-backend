import { ServiceType } from 'src/database/entities/request-confirm-service.entity';

export class RequestConfirmServiceResponse {
  id: string;
  requestConfirmId: string;
  name: string;
  type: ServiceType;
  price: string;
  image: string;
  note: string;
  createAt: number;
  updateAt: number;
} 