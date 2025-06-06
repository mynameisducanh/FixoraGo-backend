import { Expose, Transform } from 'class-transformer';

export class ActivityLogResponse {
  @Expose()
  id: string;

  @Expose({ name: 'activitytype' })
  activityType: string;

  @Expose({ name: 'fixerid' })
  fixerId: string;

  @Expose({ name: 'userid' })
  userId: string;

  @Expose({ name: 'requestserviceid' })
  requestServiceId: string;

  @Expose({ name: 'requestconfirmid' })
  requestConfirmId: string;

  @Expose()
  note: string;

  @Expose({ name: 'imageurl' })
  imageUrl: string;

  @Expose()
  address: string;

  @Expose()
  latitude: string;

  @Expose()
  longitude: string;

  @Expose()
  temp: string;

  @Expose()
  @Transform(({ value }) => value || null)
  createAt: number;

  @Expose()
  @Transform(({ value }) => value || null)
  updateAt: number;

  @Expose()
  @Transform(({ value }) => value || null)
  deleteAt: number;
}
