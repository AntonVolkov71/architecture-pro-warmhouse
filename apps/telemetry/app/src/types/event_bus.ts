export enum ExchangesList {
  CONNECT_TO_DEVICE = 'connect_to_device',
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

