import { Exclude } from 'class-transformer';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Exclude()
@Entity('Users')
export class UsersEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('bigint', { name: 'CreateAt', nullable: true })
  createAt: number;

  @Column('bigint', { name: 'UpdateAt', nullable: true })
  updateAt: number;

  @Column('bigint', { name: 'DeleteAt', nullable: true })
  deleteAt: number;

  @Column('varchar', { name: 'Username', nullable: true })
  username: string;

  @Column('varchar', { name: 'Password', nullable: true })
  password: string;

  @Column('varchar', { name: 'AuthData', nullable: true })
  authData: string;

  @Column('varchar', { name: 'AuthService', nullable: true })
  authService: string;

  @Column('varchar', { name: 'GoogleId', nullable: true })
  googleId: string;

  @Column('varchar', { name: 'FacebookId', nullable: true })
  facebookId: string;

  @Column('varchar', { name: 'Email', nullable: true })
  email: string;

  @Column('tinyint', { name: 'EmailVerified', nullable: true })
  emailVerified: number;

  @Column('tinyint', { name: 'PhoneVerified', nullable: true })
  phoneVerified: number;

  @Column('tinyint', { name: 'InfoVerified', nullable: true })
  infoVerified: number;

  @Column('varchar', { name: 'PhoneNumber', nullable: true })
  phoneNumber: string;

  @Column('varchar', { name: 'FirstName', nullable: true })
  firstName: string;

  @Column('varchar', { name: 'LastName', nullable: true })
  lastName: string;

  @Column('text', { name: 'Roles', nullable: true })
  roles: string;

  @Column('bigint', { name: 'LastPasswordUpdate', nullable: true })
  lastPasswordUpdate: number;

  @Column('bigint', { name: 'LastPictureUpdate', nullable: true })
  lastPictureUpdate: number;

  @Column('text', { name: 'Address', nullable: true })
  address: string;

  @Column('text', { name: 'CurrentLocation', nullable: true })
  currentLocation: string;

  @Column('tinyint', { name: 'Status', default: 0 })
  status: number;

  @Column('bigint', { name: 'LastCheckIn', nullable: true })
  lastCheckIn: number;

  @Column('json', { name: 'Timezone', nullable: true })
  timezone: Record<string, any>;
}
