import { Expose, Transform } from 'class-transformer';

export class ListDetailServiceResponse {
  @Expose()
  id: number;

  @Expose()
  serviceId: string;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  unit: string;
}
