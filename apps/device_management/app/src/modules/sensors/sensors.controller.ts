import {Body, Controller, Delete, Get, Param, Patch, Post, Put,} from '@nestjs/common';
import {CreateSensorDto} from '../../types/sensors/dto/create.sensor.dto';
import {SensorsService} from './sensors.service';
import {UpdateSensorDto} from '../../types/sensors/dto/update.sensor.dto';

@Controller('/sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {
  }

  @Get()
  getAll() {
    console.info('getAll',);
    return this.sensorsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateSensorDto) {
    console.info('create', dto);
    return this.sensorsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSensorDto) {
    return this.sensorsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    console.info('remove', id);
    return this.sensorsService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body() dto: { status: string }) {
    console.info('updateStatus', id, dto.status);
    return this.sensorsService.updateStatus(id, dto.status);
  }

  @Post(':id/command')
  handleCommand(@Param('id') id: number, @Body() dto: { command: string }) {
    return this.sensorsService.handleCommand(id, dto.command);
  }
}
