export enum SensorType {
    TEMPERATURE = 'temperature',
    SWITCH = 'switch',
    HUMIDITY = 'humidity',
}

export enum ConnectType {
    SOCKET = 'socket',
    DEFAULT = 'default',
}

export enum ConnectSubType {
    DEFAULT = 'default',
    SOCKET_DEFAULT = 'socket_default',
    SOCKET_TCP = 'socket_tcp',
}

export interface ISensor {
    id: number;
    name: string;
    type: SensorType;
    connect_type: ConnectType;
    connect_sub_type: ConnectSubType;
    location: string;
    value: number;
    status: boolean;
    unit: string;
    last_updated: Date;
    created_at: Date;
}
