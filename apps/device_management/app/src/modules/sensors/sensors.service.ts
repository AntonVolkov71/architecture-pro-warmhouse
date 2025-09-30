import {Injectable} from '@nestjs/common';
import {UpdateSensorDto} from '../../types/sensors/dto/update.sensor.dto';
import {CreateSensorDto} from '../../types/sensors/dto/create.sensor.dto';
import {SensorRepository} from './sensors.repository';
import {SensorEntity} from '../../types/sensors/sensor.entity';
import {EventBusService} from '../eventBus/EventBus.service';
import {ConnectToStartContract} from '../../assets/contracts/event_bus/connect_to.start';
import {ConnectToStopContract} from '../../assets/contracts/event_bus/connect_to.stop';
import {CommandSensorContract} from '../../assets/contracts/event_bus/command.sensor.emit';

@Injectable()
export class SensorsService {
  constructor(
    private readonly repository: SensorRepository,
    private readonly eventBusService: EventBusService
  ) {
  }

  public async handleStatus(sensor: UpdateSensorDto) {
    await this.update(sensor.id, sensor);
  }

  public async findAll() {
    const sensors = await this.repository.findAll({});

    return sensors.map((entity) => this.adapterToOldEntity(entity));
  }

  public async create(dto: CreateSensorDto) {
    const createEntity = new SensorEntity();
    createEntity.initialization(dto);

    const entity = await this.repository.save(createEntity);

    this.sendConnectStart(entity);
    return this.adapterToOldEntity(entity);
  }

  public async update(id: number, dto: UpdateSensorDto) {
    const existed = await this.repository.findOne({
      id,
    });

    if (!existed) {
      return 'Not found';
    }

    Object.assign(existed, dto);

    const entity = await this.repository.save(existed);

    return this.adapterToOldEntity(entity);
  }

  public async remove(id: number) {
    const existed = await this.repository.findOne({
      id,
    });

    if (!existed) {
      return 'Not found';
    }

    this.sendConnectStop(existed);

    return this.repository.delete(id);
  }

  public updateStatus(id: number, status: string) {
    console.log('updateStatus', id, status);
    return status;
  }

  public async handleCommand(id: number, command: string) {
    const existed = await this.repository.findOne({
      id,
    });

    if (!existed) {
      return 'Not found';
    }

    this.sendCommand(existed, command);
    return command;
  }

  private adapterToOldEntity(entity: SensorEntity) {
    const {status, ...rest} = entity;

    return {
      ...rest,
      status: status ? 'true' : 'false',
    };
  }

  private sendCommand(sensor: SensorEntity, command: string) {
    this.eventBusService.publish<CommandSensorContract.Request>(
      CommandSensorContract.routingKey,
      CommandSensorContract.exchange,
      {
        sensor,
        command
      }
    );
  }

  private sendConnectStart(sensor: SensorEntity) {
    this.eventBusService.publish<ConnectToStartContract.Request>(
      ConnectToStartContract.routingKey,
      ConnectToStartContract.exchange,
      {
        sensor,
      }
    );
  }

  private sendConnectStop(sensor: SensorEntity) {
    this.eventBusService.publish<ConnectToStopContract.Request>(
      ConnectToStopContract.routingKey,
      ConnectToStopContract.exchange,
      {
        sensor,
      }
    );
  }
}
