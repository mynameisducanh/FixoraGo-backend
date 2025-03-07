import { Expose } from 'class-transformer';

export class IconServiceResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  url: string;

  @Expose()
  type: string;

  @Expose()
  idService: string;

  @Expose()
  totalViews: string;
}
