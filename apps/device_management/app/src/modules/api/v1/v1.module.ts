import {Module} from '@nestjs/common';
import {SensorsModule} from '../../sensors/sensors.module';
import {RouterModule} from '@nestjs/core';

@Module({
  imports: [
    SensorsModule,
    RouterModule.register([
      {path: 'api/v1', module: SensorsModule}
    ])
  ]
})
export class V1Module {
}
