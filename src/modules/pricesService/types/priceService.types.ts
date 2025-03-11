import { Expose } from 'class-transformer';

export class PriceServiceResponse {
  @Expose()
  id: number;
  
  @Expose()
  name: string;

  @Expose()
  serviceId: string;

  @Expose()
  unitService: string;

  @Expose()
  price: string;

  @Expose()
  min_price: string;

  @Expose()
  max_price: string;
  
  @Expose()
  imageUrl: string;

  @Expose()
  totalUse: string;
}
