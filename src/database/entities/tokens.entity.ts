import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestamp } from './base-timestamp';

@Entity('Tokens')
export class TokensEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @Column({
    nullable: false,
    name: 'RefreshToken',
    type: 'text'
  })
  refreshToken: string;

  @Column({
    nullable: false,
    name: 'refreshPublicKey',
    type: 'text'
  })
  refreshPublicKey: string;

  @Column({
    nullable: false,
    name: 'accessPublicKey',
    type: 'text'
  })
  accessPublicKey: string;

  @Column({
    nullable: false,
    name: 'UserId',
    type: 'uuid'
  })
  userId: string;

  @Column({
    nullable: false,
    name: 'ExpireAt',
    type: 'timestamp'
  })
  expireAt: Date;
}
