import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  nameApplication(): string {
    return process.env['NAME_APPLICATION'] || 'enter name App';
  }
}
