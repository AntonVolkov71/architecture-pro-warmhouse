import { Module } from '@nestjs/common';
import { ConnectingToDeviceService } from './connectingToDevice.service';
import { EventBusModule } from '../eventBus/EventBus.module';
import { DeviceModule } from '../devices/device.module';

@Module({
  imports: [EventBusModule, DeviceModule],
  providers: [ConnectingToDeviceService],
  exports: [ConnectingToDeviceService],
})
export class ConnectingToDeviceModule {}
