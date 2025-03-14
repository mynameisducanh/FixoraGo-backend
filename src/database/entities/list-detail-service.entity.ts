import { Exclude } from 'class-transformer';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity('listDetailService')
export class ListDetailServiceEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'serviceId' })
  service_id: number;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: true })
  name: string;

  @Column({ name: 'unit', nullable: true })
  unit: string;

  @Column({ name: 'type', nullable: true })
  type: string;
}
