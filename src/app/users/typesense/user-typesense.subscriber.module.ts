import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { UserTypesenseSubscriber } from './user-typesense.subscriber.js'

@Module({
  imports: [
    PgBossSchedulerModule
  ],
  providers: [
    UserTypesenseSubscriber
  ]
})
export class UserTypesenseSubscriberModule {}
