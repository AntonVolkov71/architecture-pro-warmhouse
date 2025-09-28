import { TypeOrmRepository } from '../../types/db';
import { SensorEntity } from '../../types/sensors/sensor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SensorRepository extends TypeOrmRepository<SensorEntity> {
  constructor(
    @InjectRepository(SensorEntity)
    repository: Repository<SensorEntity>
  ) {
    super(repository);
  }
}
