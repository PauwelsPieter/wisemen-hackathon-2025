import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { NotificationPreferences } from '../../../entities/notification-preferences.entity.js'
import { NotificationPreferencesEntityBuilder } from '../../../entity-builders/notification-preferences.entity.builder.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { UpdateMyChannelNotificationPreferenceCommandBuilder } from '../update-my-channel-notification-preference.command.builder.js'

describe('Update my channel notification preferences e2e test', () => {
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

  it('should update global notification preferences', async () => {
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

    await dataSource.manager.insert(NotificationPreferences,
      [emailNotificationPreferences, appNotificationPreferences, smsNotificationPreferences]
    )

    const command = new UpdateMyChannelNotificationPreferenceCommandBuilder()
      .withChannel(NotificationChannel.SMS)
      .withIsEnabled(true)
      .build()

    const response = await request(app.getHttpServer())
      .patch(`/me/notification-preferences/channels`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(204)

    const updatedSmsNotificationPreferences = await dataSource.manager.findOne(
      NotificationPreferences,
      {
        where: {
          userUuid: adminUser.user.uuid,
          channel: NotificationChannel.SMS
        }
      }
    )

    expect(updatedSmsNotificationPreferences?.isEnabled).toEqual(true)
  })
})
