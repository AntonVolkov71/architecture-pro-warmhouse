export enum ExchangesList {
  CONNECT_TO_DEVICE = 'connect_to_device',
}

export enum ConnectToDeviceList {
  SOCKET = 'socket',
}
export enum ConnectToDeviceSubTypesList {
  SOCKET_DEFAULT = 'socket_default',
  SOCKET_TCP = 'socket_tcp',
}

export type ExchangeDetailType = 'topic' | 'fanout' | 'direct'

export type ExchangeType<T> = {
  name: T,
  type: ExchangeDetailType
  createExchangeIfNotExists: boolean
}

export const eventBusSchema: { [key in ExchangesList]: ExchangeType<ExchangesList> } = {
  [ExchangesList.CONNECT_TO_DEVICE]: {
    name: ExchangesList.CONNECT_TO_DEVICE,
    type: 'direct',
    createExchangeIfNotExists: true
  }
};

export class DeviceDto {
  id: number;
  title: string;
  status_connection: boolean;
  serial_number: string;
  type_name: ConnectToDeviceSubTypesList;
  description: string;
  ip : string
  port : number
}
