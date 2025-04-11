import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { ContactTypesenseSubscriber } from './contact.typesense-subscriber.js'

@Module({
  imports: [PgBossSchedulerModule],
  providers: [ContactTypesenseSubscriber]
})
export class ContactTypesenseSubscriberModule {}
