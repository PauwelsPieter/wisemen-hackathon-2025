import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { Repository } from 'typeorm'
import { expect } from 'expect'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { NotificationMigration } from '../../../entities/notification-migration.entity.js'
import { MigrateNotificationTypesUseCase } from '../migrate-notification-types.use-case.js'
import { NotificationMigrationEntityBuilder } from '../../../entity-builders/notification-migration.entity.builder.js'
import { MigrateNotificationTypesCommandBuilder } from '../migrate-notification-types.command.builder.js'
import { MigrationAlreadyPerformedError } from '../../../errors/migration-already-performed.error.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { NotificationTypesMigratedEvent } from '../notification-types-migrated.event.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { DomainEventEmitter } from '../../../../domain-events/domain-event-emitter.js'

describe('MigrateNotificationsUseCase - Unit Tests', () => {
  before(() => TestBench.setupUnitTest())

  it('Should throw error when migration already exists', async () => {
    const repo = createStubInstance(Repository<NotificationMigration>)
    const jobScheduler = createStubInstance(PgBossScheduler)
    const eventEmitter = createStubInstance(DomainEventEmitter)

    repo.find.resolves([
      new NotificationMigrationEntityBuilder()
        .withType(NotificationType.USER_CREATED)
        .build()
    ])

    const useCase = new MigrateNotificationTypesUseCase(
      stubDataSource(),
      repo,
      jobScheduler,
      eventEmitter
    )

    const command = new MigrateNotificationTypesCommandBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .build()

    await expect(useCase.execute(command)).rejects.toThrow(MigrationAlreadyPerformedError)
  })

  it(`Should schedule jobs for every type in command, 
    if there is already a migration for a notification with the same category isNewCategory
     should be false else isNewCategory is true`, async () => {
    const repo = createStubInstance(Repository<NotificationMigration>)
    const jobScheduler = createStubInstance(PgBossScheduler)
    const eventEmitter = createStubInstance(DomainEventEmitter)

    repo.find.resolves([])

    const useCase = new MigrateNotificationTypesUseCase(
      stubDataSource(),
      repo,
      jobScheduler,
      eventEmitter
    )

    const command = new MigrateNotificationTypesCommandBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .build()

    await useCase.execute(command)

    expect(repo.insert.firstCall.firstArg).toHaveLength(1)
    expect(jobScheduler.scheduleJobs.firstCall.firstArg.length).toBe(1)
    expect(jobScheduler.scheduleJobs.firstCall.firstArg).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: {
            type: NotificationType.USER_CREATED,
            isNewCategory: true
          }
        })
      ])
    )
  })

  it(`Emits a NotificationTypesMigrated event`, async () => {
    const repo = createStubInstance(Repository<NotificationMigration>)
    const jobScheduler = createStubInstance(PgBossScheduler)
    const eventEmitter = createStubInstance(DomainEventEmitter)

    repo.find.resolves([])

    const useCase = new MigrateNotificationTypesUseCase(
      stubDataSource(),
      repo,
      jobScheduler,
      eventEmitter
    )

    const command = new MigrateNotificationTypesCommandBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .build()

    await useCase.execute(command)

    expect(eventEmitter).toHaveEmitted(new NotificationTypesMigratedEvent(command.types))
  })
})
