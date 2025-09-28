import {ConnectSubType, ConnectType, ISensor, SensorType,} from '../sensor.interface';

export class CreateSensorDto
    implements Omit<ISensor, 'id' | 'status' | 'last_updated' | 'value' | 'created_at'> {
    name: string;
    type: SensorType;
    connect_type: ConnectType;
    connect_sub_type: ConnectSubType;
    location: string;
    unit: string;
}
