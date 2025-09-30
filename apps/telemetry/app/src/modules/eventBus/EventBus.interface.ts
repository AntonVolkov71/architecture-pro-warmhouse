import { Logger } from "@nestjs/common";

export abstract class EventBusInterface {
  protected readonly logger: Logger = new Logger(EventBusInterface.name);

  abstract connect(): void;

  abstract publish<T>(routingKey: string, exchange: string, request: T): void;

  abstract send<Req, Res>(
    exchange: string,
    routingKey: string,
    request?: Req
  ): Promise<Res | undefined | null>;
}

