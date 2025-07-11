import { Expose, Transform } from 'class-transformer';
import { PaginationResponse } from 'src/common/types/pagination';

export class UserResponse {
  @Expose()
  id: string;

  @Expose()
  firstname: string;

  @Expose()
  username?: string;

  @Expose()
  lastname: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.firstname && obj.lastname ? obj.firstname + ' ' + obj.lastname : '',
  )
  fullName: string;

  @Expose({ name: 'emailverified' })
  emailVerified: number;

  @Expose()
  phoneVerified: number;

  @Expose({ name: 'infoverified' })
  infoVerified: number;

  @Expose()
  email: string;

  @Expose()
  roles: string;

  @Expose()
  userFolderId: string;
  @Expose()
  address: string;
  @Expose()
  phonenumber: string;
  @Expose({name :'currentlocation'})
  currentLocation: string;
  @Expose()
  authdata: string;
  @Expose({name :'lastcheckin'})
  lastCheckIn: number;
  @Expose()
  gioitinh: string;

  @Expose()
  avatarurl: string;

  @Expose({ name: 'createat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  createAt: number;

  @Expose({ name: 'updateat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  updateAt: number;

  @Expose({ name: 'deleteat' })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  deleteAt: number;
}
export class Users extends PaginationResponse<UserResponse> {}
