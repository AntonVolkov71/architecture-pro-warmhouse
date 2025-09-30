import { Injectable } from '@nestjs/common';

@Injectable()
export class EventBusConfigService {
  uri(): string {
    const uri = process.env['URI_EVENT_BUS'];

    return uri || 'amqp://localhost:5672';
  }
}
