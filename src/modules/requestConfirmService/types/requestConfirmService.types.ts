import { Expose, Transform } from 'class-transformer';
import { ServiceType } from 'src/database/entities/request-confirm-service.entity';

export class RequestConfirmServiceResponse {
  @Expose()
  id: string;

  @Expose({ name: 'requestserviceid' })
  requestConfirmId: string;
  @Expose({ name: 'userId' })
  userId: string;
  @Expose({ name: 'name' })
  name: string;
  @Expose({ name: 'type' })
  type: ServiceType;
  @Expose({ name: 'price' })
  price: string;
  @Expose({ name: 'useraccept' })
  userAccept: string;
  @Expose({ name: 'image' })
  image: string;
  @Expose({ name: 'note' })
  note: string;
  @Expose({ name: 'createat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  createAt: number;

  @Expose({ name: 'updateat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  updateAt: number;

  @Expose({ name: 'deleteat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  deleteAt: number;
}
