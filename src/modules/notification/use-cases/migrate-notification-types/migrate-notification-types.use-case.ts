import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { NotificationMigration } from '../../entities/notification-migration.entity.js'
import { MigrationAlreadyPerformedError } from '../../errors/migration-already-performed.error.js'
import { AddNewNotificationTypeToPreferencesJob } from '../add-new-notification-type-to-preferences/add-new-notification-type-to-preferences.job.js'
import { NotificationMigrationEntityBuilder } from '../../entity-builders/notification-migration.entity.builder.js'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { notificationCategory } from '../../notification-category.js'
import { MigrateNotificationTypesCommand } from './migrate-notification-types.command.js'
import { NotificationTypesMigratedEvent } from './notification-types-migrated.event.js'

@Injectable()
export class MigrateNotificationTypesUseCase {
  constructor (
    private readonly dataSource: DataSource,
    @InjectRepository(NotificationMigration)
    private readonly notificationMigrationRepo: Repository<NotificationMigration>,
    private jobScheduler: PgBossScheduler,
    private eventEmitter: DomainEventEmitter
  ) {}

  async execute (command: MigrateNotificationTypesCommand): Promise<void> {
    const existingMigrations = await this.notificationMigrationRepo.find()
    const jobs: AddNewNotificationTypeToPreferencesJob[] = []
    const notificationMigrations: NotificationMigration[] = []

    for (const notificationType of command.types) {
      this.assertMigrationHasNotYetBeenPerformed(existingMigrations, notificationType)

      const isNewCategory = !this.categoryAlreadyMigrated(existingMigrations, notificationType)
      notificationMigrations.push(
        new NotificationMigrationEntityBuilder()
          .withType(notificationType)
          .build()
      )

      const job = new AddNewNotificationTypeToPreferencesJob(notificationType, isNewCategory)
      jobs.push(job)
    }

    await transaction(this.dataSource, async () => {
      await this.notificationMigrationRepo.insert(notificationMigrations)
      await this.jobScheduler.scheduleJobs(jobs)
      await this.eventEmitter.emitOne(new NotificationTypesMigratedEvent(command.types))
    })
  }

  private assertMigrationHasNotYetBeenPerformed (
    existingMigrations: NotificationMigration[],
    type: NotificationType
  ): void {
    for (const migration of existingMigrations) {
      if (migration.type === type) {
        throw new MigrationAlreadyPerformedError(type)
      }
    }
  }

  private categoryAlreadyMigrated (
    existingMigrations: NotificationMigration[],
    type: NotificationType
  ): boolean {
    const category = notificationCategory(type)

    for (const migration of existingMigrations) {
      if (category === notificationCategory(migration.type)) {
        return true
      }
    }
    return false
  }
}
