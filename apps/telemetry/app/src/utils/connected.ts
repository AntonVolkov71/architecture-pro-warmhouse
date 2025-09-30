import {ConfigModule, ConfigService} from '@nestjs/config';
import configurationApp from '../configuration/app/configuration';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EntityClassOrSchema} from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export const ConfigModuleForApp = ConfigModule.forRoot({
  load: [configurationApp],
  isGlobal: true
});

// добавление таблиц в модуль
export const connectedEntitiesInModule = (...entities: EntityClassOrSchema[]) =>
  TypeOrmModule.forFeature(entities);

// подключение к БД
export const connectedToDB = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {

    return {
      type: configService.get<'postgres'>('database.type'),
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      username: configService.get<string>('database.username'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.database'),
      autoLoadEntities: true,
      synchronize: true,
    };
  },
  imports: undefined,
});
