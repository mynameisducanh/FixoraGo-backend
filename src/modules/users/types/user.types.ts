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

  @Expose()
  emailVerified: boolean;

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
  @Expose()
  authdata: string;
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
export class Users extends PaginationResponse<UserResponse> {}
