import { Expose, Transform } from 'class-transformer';

export class RequestServiceResponse {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  staffId: string;

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
