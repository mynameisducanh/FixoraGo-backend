import { Exclude } from 'class-transformer';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity('historyActiveRequest')
export class HistoryActiveRequestEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid',{ nullable: true, name: 'RequestServiceId' })
  requestServiceId: string;

  @Column({
    nullable: true,
    name: 'Name',
  })
  name: string;

  @Column({
    nullable: true,
    name: 'RequestConfirmId',
  })
  requestConfirmId: string;

  @Column({ nullable: true, name: 'Url' })
  url: string;

  @Column({ nullable: true, name: 'Type' })
  type: string;

  @Column('uuid',{ nullable: true, name: 'IdService' })
  idService: string;
}
