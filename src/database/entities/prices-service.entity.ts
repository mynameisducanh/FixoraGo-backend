import { Exclude } from 'class-transformer';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity('pricesService')
export class PricesServiceEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ServiceId' })
  serviceId: number;

  @Column({ name: 'UnitService' })
  unitService: string;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: true })
  name: string;

  @Column({ name: 'price', nullable: true })
  price: string;

  @Column({ name: 'min_price', nullable: true })
  min_price: string;

  @Column({ name: 'max_price', nullable: true })
  max_price: string;

  @Column({ name: 'ImageUrl', nullable: true })
  imageUrl: string;

  @Column({ name: 'TotalUse', nullable: true })
  totalUse: string;
}
