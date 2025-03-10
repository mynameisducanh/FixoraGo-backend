import { Expose } from 'class-transformer';

export class ListDetailServiceResponse {
  @Expose()
  id: number;

  @Expose()
  service_id: number;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  unit: string;
}
