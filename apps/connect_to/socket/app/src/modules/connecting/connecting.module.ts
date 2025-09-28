import { Module } from '@nestjs/common';
import { ConnectingToService } from './connecting.service';
import { EventBusModule } from '../event_bus/EventBus.module';

@Module({
  imports: [EventBusModule],
  providers: [ConnectingToService],
  exports: [ConnectingToService],
})
export class ConnectingToModule {}
