import { ConfigModule } from '@nestjs/config';
import configurationApp from '../configuration/app/configuration';

export const ConfigModuleForApp = ConfigModule.forRoot({
  load: [configurationApp],
  isGlobal: true,
});
