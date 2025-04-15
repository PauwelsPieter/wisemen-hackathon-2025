import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { NotificationPreferences } from '../../../entities/notification-preferences.entity.js'
import { NotificationPreferencesEntityBuilder } from '../../../entity-builders/notification-preferences.entity.builder.js'
import { NotificationPreferencesPresetEntityBuilder } from '../../../entity-builders/notification-preferences-preset.entity.builder.js'
import { NotificationPreset } from '../../../enums/notification-preset.enum.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { NotificationPreferencesPreset } from '../../../entities/notification-preferences-preset.entity.js'

describe('Get my notification preferences e2e test', () => {
  let testSetup: EndToEndTestSetup
  let app: NestExpressApplication
  let dataSource: DataSource
  let adminUser: TestUser

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    dataSource = testSetup.dataSource
    app = testSetup.app

    adminUser = await testSetup.authContext.getAdminUser()
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('returns notification preferences: Custom Preset', async () => {
    const notificationPreset = new NotificationPreferencesPresetEntityBuilder()
      .withPreset(NotificationPreset.CUSTOM)
      .withUserUuid(adminUser.user.uuid)
      .build()

    const emailNotificationPreferences = new NotificationPreferencesEntityBuilder()
      .withUserUuid(adminUser.user.uuid)
      .withChannel(NotificationChannel.EMAIL)
      .withTypes([NotificationType.USER_CREATED])
      .withIsEnabled(true)
      .build()

    const appNotificationPreferences = new NotificationPreferencesEntityBuilder()
      .withUserUuid(adminUser.user.uuid)
      .withChannel(NotificationChannel.APP)
      .withTypes([NotificationType.USER_CREATED])
      .withIsEnabled(false)
      .build()

    const smsNotificationPreferences = new NotificationPreferencesEntityBuilder()
      .withUserUuid(adminUser.user.uuid)
      .withChannel(NotificationChannel.SMS)
      .withTypes([NotificationType.USER_CREATED])
      .withIsEnabled(false)
      .build()

    await dataSource.manager.insert(NotificationPreferencesPreset, [notificationPreset])
    await dataSource.manager.insert(NotificationPreferences,
      [emailNotificationPreferences, appNotificationPreferences, smsNotificationPreferences]
    )

    const response = await request(app.getHttpServer())
      .get(`/me/notification-preferences`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
    expect(response.body).toEqual({
      preset: NotificationPreset.CUSTOM,
      emailEnabled: true,
      smsEnabled: false,
      appEnabled: false,
      pushEnabled: false,
      preferences: {
        email: [NotificationType.USER_CREATED],
        sms: [NotificationType.USER_CREATED],
        app: [NotificationType.USER_CREATED],
        push: []
      }
    })
  })
})
