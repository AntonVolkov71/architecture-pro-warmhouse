import { EventBusInterface } from '../../EventBus.interface';
import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class EventBusRabbitMqService extends EventBusInterface {
  private readonly SEND_ERROR = 'EventBus RabbitMq Service send error: ';

  constructor(
    private readonly amqpConnection: AmqpConnection
  ) {
    super();
  }

  public connect() {
    this.logger.log(`is connected ${this.amqpConnection.connected}`);
  }

  public publish<T>(routingKey: string, exchange: string, request: T): void {
    try {
      this.amqpConnection.publish(exchange, routingKey, request)
        .catch((e) => {
          console.error(`EventBusRabbitMqService Publish message error: ${e.message}`);
        });

    } catch (e) {
      if (e instanceof Error) {
        console.error(`EventBusRabbitMqService Publish message error: ${e.message}`);
      }
    }
  }

  public async send<Req, Res>(
    exchange: string,
    routingKey: string,
    request?: Req
  ): Promise<Res | undefined | null> {
    try {
      const result = await this.amqpConnection
        .request<Res>({ exchange, routingKey, payload: request })
        .catch((e) => {
          throw e;
        });

      if (!result) {
        return;
      }

      return result;
    } catch (e) {
      if (e instanceof Error) {
        console.error(this.SEND_ERROR + e.message);
      }

      throw e;
    }
  }
}
