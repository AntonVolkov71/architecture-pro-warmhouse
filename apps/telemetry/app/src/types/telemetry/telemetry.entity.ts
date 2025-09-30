import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Telemetry } from './telemetry';

@Entity('telemetry')
export class TelemetryEntity extends BaseEntity implements Telemetry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  air_temperature: number;

  @Column()
  sensor_id: number;

  @Column()
  humidity: number;

  @Column()
  status_connection: boolean;

  public initialization(dto: Telemetry) {
    Object.assign(this, dto);
  }
}
