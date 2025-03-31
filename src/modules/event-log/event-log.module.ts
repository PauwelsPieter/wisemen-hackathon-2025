import { Module } from '@nestjs/common'
import { ViewEventLogIndexModule } from './use-cases/view-event-log-index/view-event-log-index.module.js'

@Module({
  imports: [
    ViewEventLogIndexModule
  ]
})
export class EventLogModule {}
