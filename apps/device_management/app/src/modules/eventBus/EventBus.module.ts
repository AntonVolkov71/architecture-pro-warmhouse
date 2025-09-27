import { Module } from "@nestjs/common";
import { EventBusService } from "./EventBus.service";
import { EventBusConfigModule } from "../../configuration/eventBus/config.module";

@Module({
  imports: [EventBusConfigModule],
  providers: [EventBusService],
  exports: [EventBusService, EventBusConfigModule]
})

export class EventBusModule {
}
