import { before, describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { Repository } from 'typeorm'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { NotificationPreferencesPreset } from '../../../entities/notification-preferences-preset.entity.js'
import { NotificationPreferencePresetUpdatedEvent } from '../notification-preference-preset-updated.event.js'
import { UpdateNotificationPresetPreferenceUseCase } from '../update-my-notification-preference-preset.use-case.js'
import { UpdateMyNotificationPreferencePresetCommandBuilder } from '../update-my-notification-preference-preset.command.builder.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { AuthContext } from '../../../../auth/auth.context.js'
import { DomainEventEmitter } from '../../../../domain-events/domain-event-emitter.js'

describe('UpdateNotificationPresetPreferenceUseCase - Unit Tests', () => {
  before(() => TestBench.setupUnitTest())

  it('should emit NotificationPresetPreferenceUpdatedEvent', async () => {
    const repository = createStubInstance(Repository<NotificationPreferencesPreset>)
    repository.upsert.resolves()

    const userUuid = randomUUID()
    const authContext = createStubInstance(AuthContext)
    authContext.getUserUuidOrFail.returns(userUuid)

    const eventEmitter = createStubInstance(DomainEventEmitter)
    const useCase = new UpdateNotificationPresetPreferenceUseCase(
      stubDataSource(),
      repository,
      authContext,
      eventEmitter
    )

    const command = new UpdateMyNotificationPreferencePresetCommandBuilder().build()

    await useCase.execute(command)

    expect(eventEmitter).toHaveEmitted(
      new NotificationPreferencePresetUpdatedEvent(userUuid, command.preset)
    )
  })
})
