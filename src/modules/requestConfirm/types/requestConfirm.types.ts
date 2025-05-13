import { Expose, Transform } from 'class-transformer';
import { ConfirmStatus } from 'src/database/entities/request-confirm.entity';

export class RequestConfirmResponse {
  @Expose()
  id: string;

  @Expose({ name: 'userid' })
  userId: string;

  @Expose({ name: 'staffid' })
  staffId: string;

  @Expose({ name: 'requestserviceid' })
  requestServiceId: string;

  @Expose({ name: 'proposedprice' })
  proposedPrice: string;

  @Expose({ name: 'negotiatedprice' })
  negotiatedPrice: string;

  @Expose({ name: 'usernote' })
  userNote: string;

  @Expose({ name: 'staffnote' })
  staffNote: string;

  @Expose()
  status: ConfirmStatus;

  @Expose({ name: 'staffverified' })
  staffVerified: string;

  @Expose({ name: 'userverified' })
  userVerified: string;

  @Expose({ name: 'createat' })
  @Transform(({ value }) => value ? parseInt(value) : null)
  createAt: number;

  @Expose({ name: 'updateat' })
  @Transform(({ value }) => value ? parseInt(value) : null)
  updateAt: number;

  @Expose({ name: 'deleteat' })
  @Transform(({ value }) => value ? parseInt(value) : null)
  deleteAt: number;
}
