import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { User } from '../entities/user.entity.js'
import { UserTypesenseCollector } from './user-typesense.collector.js'
import { UserTypesenseSubscriber } from './user-typesense.subscriber.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PgBossSchedulerModule
  ],
  providers: [
    UserTypesenseCollector,
    UserTypesenseSubscriber
  ],
  exports: [UserTypesenseCollector]
})
export class UserTypesenseModule {}
