import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  nameApplication(): string {
    return process.env['NAME_APPLICATION'] || 'enter name App';
  }

  port(): number {
    return Number.parseInt(process.env['PORT_APPLICATION'] || '9999');
  }
}
