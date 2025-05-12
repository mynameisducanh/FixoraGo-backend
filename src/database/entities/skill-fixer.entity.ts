import { Exclude } from 'class-transformer';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity('skillFixer')
export class SkillFixerEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true, name: 'userId' })
  userId: string;

  @Column({
    nullable: true,
    name: 'Name',
  })
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  temp: string;
}
