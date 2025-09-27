import {Injectable} from '@nestjs/common';
import {DeviceDto} from '../../types/event_bus';

@Injectable()
export class DeviceService {
  public handleStatusDevice(device: DeviceDto) {
    console.log('handleStatusDevice device', device);
  }
}
