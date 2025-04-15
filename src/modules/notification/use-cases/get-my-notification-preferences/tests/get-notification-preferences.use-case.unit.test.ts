import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { Repository } from 'typeorm'
import { expect } from 'expect'
import { NotificationPreset } from '../../../enums/notification-preset.enum.js'
import { NotificationPreferences } from '../../../entities/notification-preferences.entity.js'
import { GetMyNotificationPreferencesUseCase } from '../get-my-notification-preferences.use-case.js'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { getDefaultTypesOfChannel, getSupportedNotificationTypesOfChannel } from '../../../notification-types-config.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { AuthContext } from '../../../../auth/auth.context.js'
import { NotificationPreferencesPreset } from '../../../entities/notification-preferences-preset.entity.js'

describe('CreateNotificationUseCase - Unit Tests', () => {
  before(() => TestBench.setupUnitTest())

  it('Should return all supported notifications types when preset is ALL', async () => {
    const presetRepo = createStubInstance(Repository<NotificationPreferencesPreset>)
    const preferencesRepo = createStubInstance(Repository<NotificationPreferences>)
    const authContext = createStubInstance(AuthContext)

    presetRepo.findOneByOrFail.resolves({
      preset: NotificationPreset.ALL
    })

    const useCase = new GetMyNotificationPreferencesUseCase(
      preferencesRepo,
      presetRepo,
      authContext
    )

    const response = await useCase.execute()
    expect(response).toEqual({
      preset: NotificationPreset.ALL,
      emailEnabled: true,
      smsEnabled: true,
      appEnabled: true,
      pushEnabled: true,
      preferences: {
        email: getSupportedNotificationTypesOfChannel(NotificationChannel.EMAIL),
        sms: getSupportedNotificationTypesOfChannel(NotificationChannel.SMS),
        app: getSupportedNotificationTypesOfChannel(NotificationChannel.APP),
        push: getSupportedNotificationTypesOfChannel(NotificationChannel.PUSH)
      }
    })
  })

  it('Should return no notifications types when preset is NONE', async () => {
    const presetRepo = createStubInstance(Repository<NotificationPreferencesPreset>)
    const preferencesRepo = createStubInstance(Repository<NotificationPreferences>)
    const authContext = createStubInstance(AuthContext)

    presetRepo.findOneByOrFail.resolves({
      preset: NotificationPreset.NONE
    })

    const useCase = new GetMyNotificationPreferencesUseCase(
      preferencesRepo,
      presetRepo,
      authContext
    )

    const response = await useCase.execute()
    expect(response).toEqual({
      preset: NotificationPreset.NONE,
      emailEnabled: false,
      smsEnabled: false,
      appEnabled: false,
      pushEnabled: false,
      preferences: {
        email: [],
        sms: [],
        app: [],
        push: []
      }
    })
  })

  it('Should return all default notifications types when preset is Default', async () => {
    const presetRepo = createStubInstance(Repository<NotificationPreferencesPreset>)
    const preferencesRepo = createStubInstance(Repository<NotificationPreferences>)
    const authContext = createStubInstance(AuthContext)

    presetRepo.findOneByOrFail.resolves({
      preset: NotificationPreset.DEFAULT
    })

    const useCase = new GetMyNotificationPreferencesUseCase(
      preferencesRepo,
      presetRepo,
      authContext
    )

    const response = await useCase.execute()
    expect(response).toEqual({
      preset: NotificationPreset.DEFAULT,
      emailEnabled: true,
      smsEnabled: true,
      appEnabled: true,
      pushEnabled: true,
      preferences: {
        email: getDefaultTypesOfChannel(NotificationChannel.EMAIL),
        sms: getDefaultTypesOfChannel(NotificationChannel.SMS),
        app: getDefaultTypesOfChannel(NotificationChannel.APP),
        push: getDefaultTypesOfChannel(NotificationChannel.PUSH)
      }
    })
  })
})
