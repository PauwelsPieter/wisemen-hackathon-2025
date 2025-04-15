import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { NotificationMigration } from '../../entities/notification-migration.entity.js'
import { DomainEventEmitterModule } from '../../../domain-events/domain-event-emitter.module.js'
import { MigrateNotificationTypesController } from './migrate-notification-types.controller.js'
import { MigrateNotificationTypesUseCase } from './migrate-notification-types.use-case.js'

@Module({
  imports: [
    PgBossSchedulerModule,
    TypeOrmModule.forFeature([NotificationMigration]),
    DomainEventEmitterModule
  ],
  controllers: [
    MigrateNotificationTypesController
  ],
  providers: [
    MigrateNotificationTypesUseCase
  ]
})
export class MigrateNotificationTypesModule {}
