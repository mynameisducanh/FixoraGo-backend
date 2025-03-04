import { Exclude } from 'class-transformer';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity('Icons')
export class IconEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    name: 'Name',
  })
  name: string;

  @Column({ nullable: true, name: 'Url' })
  url: string;

  @Column({ nullable: true, name: 'Type' })
  type: string;
}
