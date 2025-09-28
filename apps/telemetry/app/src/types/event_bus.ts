export enum ExchangesList {
  CONNECT_TO = 'connect_to',
}

export type ExchangeDetailType = 'topic' | 'fanout' | 'direct';

export type ExchangeType<T> = {
  name: T;
  type: ExchangeDetailType;
  createExchangeIfNotExists: boolean;
};

export const eventBusSchema: {
  [key in ExchangesList]: ExchangeType<ExchangesList>;
} = {
  [ExchangesList.CONNECT_TO]: {
    name: ExchangesList.CONNECT_TO,
    type: 'direct',
    createExchangeIfNotExists: true,
  },
};
