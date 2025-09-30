import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  nameApplication(): string {
    return process.env['NAME_APPLICATION'] || 'enter name App';
  }

  portApplication(): number {
    const portENV = process['env']['SERVER_PORT'];

    return portENV ? Number(portENV) : 3000;
  }
}
