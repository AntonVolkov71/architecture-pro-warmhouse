import { Module } from '@nestjs/common';
import { SocketTcpService } from './socket_tcp.service';
import { SocketTcpTelemetryService } from './socket_tcp_telemetry.service';

@Module({
  imports: [],
  providers: [SocketTcpTelemetryService, SocketTcpService],
  exports: [SocketTcpTelemetryService, SocketTcpService],
})
export class Socket_tcpModuleServiceModule {}
