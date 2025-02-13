import { UsersEntity } from 'src/database/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Staffs')
export class StaffEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'id' })
  userId: UsersEntity;

  @Column('varchar', { name: 'EmployeeCode', unique: true })
  employeeCode: string;

  @Column('varchar', { name: 'Position' })
  position: string;
}
