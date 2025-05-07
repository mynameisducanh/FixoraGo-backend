import { Exclude } from 'class-transformer';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity('typeService')
export class TypeServiceEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ServiceId' })
  serviceId: string;

  @Column({ name: 'UnitService' })
  unitService: string;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: true })
  name: string;

  @Column({ name: 'time', nullable: true })
  time: string;

  @Column({ name: 'ImageUrl', nullable: true })
  imageUrl: string;

  @Column({ name: 'temp', nullable: true })
  temp: string;
}
