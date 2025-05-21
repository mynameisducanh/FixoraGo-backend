import { UsersEntity } from 'src/database/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Fixer')
export class FixerEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid', { name: 'UserId' })
  userId: string;

  @Column({ name: 'EmployeeCode', unique: true })
  employeeCode: string;

  @Column({ name: 'Position', nullable: true })
  position: string;

  @Column({ name: 'CurrentLocation', nullable: true })
  currentLocation: string;

  @Column({ name: 'Status', default: 0 })
  status: string;

  @Column({ name: 'LastCheckIn', nullable: true })
  lastCheckIn: string;

  @Column({ name: 'Insurance', nullable: true })
  insurance: string;

  @Column({ name: 'Expiry', nullable: true })
  expiry: string;

  @Column({ name: 'Revenue', nullable: true })
  revenue: string;

  @Column({ name: 'Tax', nullable: true })
  tax: string;

  @Column('jsonb', { name: 'Timezone', nullable: true })
  timezone: Record<string, any>;

  @Column({ name: 'Temp', nullable: true })
  temp: string;
}
