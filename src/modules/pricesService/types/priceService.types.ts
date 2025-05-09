import { Expose, Transform } from 'class-transformer';

export class PriceServiceResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  serviceId: string;

  @Expose()
  unitService: string;

  @Expose()
  time: string;

  @Expose()
  temp: string;

  @Expose()
  imageUrl: string;

  @Expose()
  @Transform(({ obj }) => new Date(parseInt(obj.createAt, 10)))
  createAt?: Date;

  @Expose()
  @Transform(({ obj }) =>
    parseInt(obj.updateAt) === 0 ? null : new Date(parseInt(obj.updateAt, 10)),
  )
  updateAt?: Date;

  @Expose()
  @Transform(({ obj }) =>
    parseInt(obj.deleteAt) === 0 ? null : new Date(parseInt(obj.deleteAt, 10)),
  )
  deleteAt?: Date;
}
