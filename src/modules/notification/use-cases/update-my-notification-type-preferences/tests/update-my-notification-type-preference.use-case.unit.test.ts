import { before, describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { Repository } from 'typeorm'
import { UpdateMyNotificationPreferenceTypeUseCase } from '../update-my-notification-type-preference.use-case.js'
import { NotificationPreferences } from '../../../entities/notification-preferences.entity.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { NotificationPreferencesEntityBuilder } from '../../../entity-builders/notification-preferences.entity.builder.js'
import { UpdateMyNotificationTypePreferenceCommandBuilder } from '../update-my-notification-type-preference.command.builder.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { AuthContext } from '../../../../auth/auth.context.js'

describe('UpdateMyNotificationTypePreference - Unit Tests', () => {
  before(() => TestBench.setupUnitTest())

  it('Enables a new notification type', async () => {
    const authContext = createStubInstance(AuthContext)
    authContext.getUserUuidOrFail.returns(randomUUID())

    const repo = createStubInstance(Repository<NotificationPreferences>)
    repo.findOneByOrFail.resolves(new NotificationPreferencesEntityBuilder()
      .withTypes([])
      .build())

    const useCase = new UpdateMyNotificationPreferenceTypeUseCase(
      repo,
      authContext
    )

    const command = new UpdateMyNotificationTypePreferenceCommandBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .withIsEnabled(true)
      .build()

    await useCase.execute(command)

    expect(repo.update.getCall(0).lastArg).toStrictEqual(expect.objectContaining({
      types: [NotificationType.USER_CREATED]
    }))
  })

  it('Removes a disabled notification type', async () => {
    const authContext = createStubInstance(AuthContext)
    authContext.getUserUuidOrFail.returns(randomUUID())

    const repo = createStubInstance(Repository<NotificationPreferences>)
    repo.findOneByOrFail.resolves(new NotificationPreferencesEntityBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .build())

    const useCase = new UpdateMyNotificationPreferenceTypeUseCase(
      repo,
      authContext
    )

    const command = new UpdateMyNotificationTypePreferenceCommandBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .withIsEnabled(false)
      .build()

    await useCase.execute(command)

    expect(repo.update.getCall(0).lastArg).toStrictEqual(expect.objectContaining({
      types: []
    }))
  })

  it('Does nothing when disabling a disabled type', async () => {
    const authContext = createStubInstance(AuthContext)
    authContext.getUserUuidOrFail.returns(randomUUID())

    const repo = createStubInstance(Repository<NotificationPreferences>)
    repo.findOneByOrFail.resolves(new NotificationPreferencesEntityBuilder()
      .withTypes([])
      .build())

    const useCase = new UpdateMyNotificationPreferenceTypeUseCase(
      repo,
      authContext
    )

    const command = new UpdateMyNotificationTypePreferenceCommandBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .withIsEnabled(false)
      .build()

    await useCase.execute(command)

    expect(repo.update.getCall(0).lastArg).toStrictEqual(expect.objectContaining({
      types: []
    }))
  })

  it('Does nothing when enabling an enabled type', async () => {
    const authContext = createStubInstance(AuthContext)
    authContext.getUserUuidOrFail.returns(randomUUID())

    const repo = createStubInstance(Repository<NotificationPreferences>)
    repo.findOneByOrFail.resolves(new NotificationPreferencesEntityBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .build())

    const useCase = new UpdateMyNotificationPreferenceTypeUseCase(
      repo,
      authContext
    )

    const command = new UpdateMyNotificationTypePreferenceCommandBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .withIsEnabled(true)
      .build()

    await useCase.execute(command)

    expect(repo.update.getCall(0).lastArg).toStrictEqual(expect.objectContaining({
      types: [NotificationType.USER_CREATED]
    }))
  })
})
