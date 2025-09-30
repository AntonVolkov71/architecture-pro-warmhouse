import {Injectable} from '@nestjs/common';
import {TelemetryEntity} from '../../types/telemetry/telemetry.entity';
import {TypeOrmRepository} from '../../types/db';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class TelemetryRepository extends TypeOrmRepository<TelemetryEntity> {
    constructor(
        @InjectRepository(TelemetryEntity)
        repository: Repository<TelemetryEntity>
    ) {
        super(repository);
    }
}
