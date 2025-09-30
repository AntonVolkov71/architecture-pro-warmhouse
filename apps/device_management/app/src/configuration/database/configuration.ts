import { registerAs } from '@nestjs/config';
import { DatabaseConfigService } from './config.service';

const databaseConfigService: DatabaseConfigService =
  new DatabaseConfigService();

export default registerAs('database', () => ({
  type: databaseConfigService.type(),
  host: databaseConfigService.host(),
  port: databaseConfigService.port(),
  database: databaseConfigService.database(),
  username: databaseConfigService.username(),
  password: databaseConfigService.password(),
}));
