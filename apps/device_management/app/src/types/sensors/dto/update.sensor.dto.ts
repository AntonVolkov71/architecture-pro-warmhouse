import {
  ConnectSubType,
  ConnectType,
  ISensor,
  SensorType,
} from '../sensor.interface';

export class UpdateSensorDto
  implements Omit<ISensor, 'last_updated' | 'created_at'>
{
  id: number;
  name: string;
  type: SensorType;
  connect_type: ConnectType;
  connect_sub_type: ConnectSubType;
  location: string;
  unit: string;
  status: boolean;
  value: number;
}
