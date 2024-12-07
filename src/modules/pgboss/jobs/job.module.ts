import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { ImportTypesenseJobModule } from '../../typesense/jobs/import-typesense/import-typesense.module.js'
import { PublishNatsEventJobModule } from '../../nats/outbox/publish-nats-event/publish-nats-event.module.js'
import { JobRegistry } from './job.registry.js'

@Module({
  imports: [
    DiscoveryModule,
    ImportTypesenseJobModule,
    PublishNatsEventJobModule
  ],
  providers: [
    JobRegistry
  ],
  exports: [
    JobRegistry
  ]
})
export class JobModule {}
