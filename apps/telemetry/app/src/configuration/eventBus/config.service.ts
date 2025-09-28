import {Injectable} from '@nestjs/common';

@Injectable()
export class EventBusConfigService {
    uri(): string {
        const uri = process.env['URI_EVENT_BUS'];

        console.info('URI_EVENT_BUS', uri);
        return uri || 'amqp://localhost:5672';
    }
}
