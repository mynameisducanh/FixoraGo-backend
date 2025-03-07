import { Exclude } from 'class-transformer';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity('service_prices')
export class ServicesPriceEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_id' })
  service_id: number;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: true })
  name: string;

  @Column({ name: 'price', nullable: true })
  price: string;

  @Column({ name: 'unit', nullable: true })
  unit: string;

  @Column({ name: 'min_price', nullable: true })
  min_price: string;

  @Column({ name: 'max_price', nullable: true })
  max_price: string;
}
