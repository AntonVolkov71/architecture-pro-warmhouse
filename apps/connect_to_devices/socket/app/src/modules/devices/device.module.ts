import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { EventBusModule } from '../eventBus/EventBus.module';

@Module({
  imports: [EventBusModule],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
