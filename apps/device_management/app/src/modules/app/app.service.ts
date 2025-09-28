import {Injectable} from '@nestjs/common';
import {EventBusService} from '../eventBus/EventBus.service';
import {EventBusRabbitMqService} from '../eventBus/rabbit-mq/services/EventBusRabbitMq.service';

@Injectable()
export class AppService {
  private readonly RECONNECTION_TIMEOUT = 5000;

  constructor(
    private readonly eventBusService: EventBusService,
    private readonly eventBusRabbitMqService: EventBusRabbitMqService,
  ) {
  }

  // запуск сервисов перед запуском
  async startServicesBeforeStart(): Promise<void> {
    try {
      // запуск шины данных
      await this.startEventBus();
    } catch (e) {
      setTimeout(() => {
        console.error('Restart before connection.');
        this.startServicesBeforeStart();
      }, this.RECONNECTION_TIMEOUT);
    }
  }

  private async startEventBus() {
    this.eventBusService.setEventBusInterface(this.eventBusRabbitMqService);

    this.eventBusService.connected();
  }
}
