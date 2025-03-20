import { Expose, Transform } from 'class-transformer';

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
