import {ConnectSubType, ConnectType, ISensor, SensorType,} from './sensor.interface';
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {CreateSensorDto} from './dto/create.sensor.dto';

@Entity('sensors')
export class SensorEntity extends BaseEntity implements ISensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column({
    type: 'enum',
    enum: SensorType,
  })
  type: SensorType;

  @Column({
    type: 'enum',
    enum: ConnectType,
    default: ConnectType.SOCKET,
  })
  connect_type: ConnectType;

  @Column({
    type: 'enum',
    enum: ConnectSubType,
    default: ConnectSubType.SOCKET_TCP,
  })
  connect_sub_type: ConnectSubType;

  @Column()
  location: string;

  @Column({
    default: 0,
  })
  value: number;

  @Column({
    default: false
  })
  status: boolean;

  @Column()
  unit: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  last_updated: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  public initialization(dto: CreateSensorDto) {
    Object.assign(this, dto);
  }
}
