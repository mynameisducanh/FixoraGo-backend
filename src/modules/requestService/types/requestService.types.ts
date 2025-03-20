import { Expose } from 'class-transformer';

export class RequestServiceResponse {
  @Expose()
  id: string;

  @Expose()
  userId: number;

  @Expose()
  staffId: number;

  @Expose()
  nameService: string;

  @Expose()
  listDetailService: string;

  @Expose()
  priceService: string;

  @Expose()
  typeService: string;

  @Expose()
  note: string;

  @Expose()
  status: string;
}
