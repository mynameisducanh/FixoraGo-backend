import { Expose, Transform } from 'class-transformer';

export class RequestServiceResponse {
  @Expose()
  id: string;

  @Expose({ name: 'userid' })
  userId: string;

  @Expose({ name: 'fixerid' })
  fixerId: string;

  @Expose({ name: 'nameservice' })
  nameService: string;

  @Expose({ name: 'listdetailservice' })
  listDetailService: string;

  @Expose({ name: 'priceservice' })
  priceService: string;

  @Expose({ name: 'typeequipment' })
  typeEquipment: string;

  @Expose({ name: 'isUrgent' })
  isUrgent: string;

  @Expose({ name: 'bonus' })
  bonus: string;

  @Expose()
  note: string;

  @Expose()
  status: string;

  @Expose()
  calender: string;

  @Expose()
  address: string;

  @Expose({ name: 'fileimage' })
  fileImage: string;

  @Expose({ name: 'createat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  createAt: number;

  @Expose({ name: 'updateat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  updateAt: number;

  @Expose({ name: 'deleteat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  deleteAt: number;

  @Expose()
  temp: string;
}
