import { Exclude } from "class-transformer";
import { BaseTimestamp } from "src/database/entities/base-timestamp";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Exclude()
@Entity('otps')
export class OtpEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  otp: string;

  @Column('bigint')
  expires: number;
}