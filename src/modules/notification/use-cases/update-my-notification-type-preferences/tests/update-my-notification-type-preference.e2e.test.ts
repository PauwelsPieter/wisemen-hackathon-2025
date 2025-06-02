import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { NotificationPreferences } from '../../../entities/notification-preferences.entity.js'
import { NotificationPreferencesEntityBuilder } from '../../../entity-builders/notification-preferences.entity.builder.js'
import { UpdateMyNotificationTypePreferenceCommandBuilder } from '../update-my-notification-type-preference.command.builder.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'

describe('Update my notification type preferences e2e test', () => {
  let testSetup: EndToEndTestSetup
  let app: NestExpressApplication
  let dataSource: DataSource
  let adminUser: TestUser

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    dataSource = testSetup.dataSource
    app = testSetup.app

    adminUser = await testSetup.authContext.getAdminUser()

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
      .withTypes([])
      .withIsEnabled(false)
      .build()

    await dataSource.manager.insert(NotificationPreferences,
      [emailNotificationPreferences, appNotificationPreferences, smsNotificationPreferences]
    )
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('should add notification preferences type', async () => {
    const command = new UpdateMyNotificationTypePreferenceCommandBuilder()
      .withChannel(NotificationChannel.SMS)
      .withIsEnabled(true)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const response = await request(app.getHttpServer())
      .patch(`/me/notification-preferences/types`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(204)

    const updatedSmsNotificationPreferences = await dataSource.manager.findOneOrFail(
      NotificationPreferences,
      {
        where: {
          userUuid: adminUser.user.uuid,
          channel: NotificationChannel.SMS
        }
      }
    )

    expect(updatedSmsNotificationPreferences.types).toStrictEqual(
      expect.arrayContaining([
        NotificationType.USER_CREATED
      ]))
  })

  it('should remove notification preferences type', async () => {
    const command = new UpdateMyNotificationTypePreferenceCommandBuilder()
      .withChannel(NotificationChannel.EMAIL)
      .withIsEnabled(false)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const response = await request(app.getHttpServer())
      .patch(`/me/notification-preferences/types`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(204)

    const updatedEmailNotificationPreferences
    = await dataSource.manager.findOneOrFail(NotificationPreferences, {
      where: {
        userUuid: adminUser.user.uuid,
        channel: NotificationChannel.EMAIL
      }
    })

    expect(updatedEmailNotificationPreferences.types).toStrictEqual(
      expect.arrayContaining([]))
  })
})
