import {Injectable} from '@nestjs/common';
import {EventBusInterface} from './EventBus.interface';

@Injectable()
export class EventBusService {
  private eventBusInterface: EventBusInterface;

  public setEventBusInterface(eventBusInterface: EventBusInterface) {
    this.eventBusInterface = eventBusInterface;
  }

  public connected(): void {
    if (this.eventBusInterface) {
      this.eventBusInterface.connect();
    }
  }

  publish<T>(routingKey: string, exchange: string, request: T): void {
    try {
      if (this.eventBusInterface) {
        this.eventBusInterface.publish<T>(routingKey, exchange, request);
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(`Publish message error: ${e.message}`);
      }
    }
  }

  async send<Req, Res>(
    exchange: string,
    routingKey: string,
    request?: Req
  ): Promise<Res | undefined | null> {
    if (this.eventBusInterface) {
      return this.eventBusInterface.send(exchange, routingKey, request);
    }

    return;
  }
}
