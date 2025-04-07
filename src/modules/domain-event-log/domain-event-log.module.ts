import { Module } from '@nestjs/common'
import { ViewDomainEventLogIndexModule } from './use-cases/view-event-log-index/view-domain-event-log-index.module.js'

@Module({
  imports: [
    ViewDomainEventLogIndexModule
  ]
})
export class DomainEventLogModule {}
