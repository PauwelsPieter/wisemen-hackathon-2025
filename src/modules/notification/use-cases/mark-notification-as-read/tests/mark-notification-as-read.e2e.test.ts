import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { UserNotification } from '../../../entities/user-notification.entity.js'
import { Notification } from '../../../entities/notification.entity.js'
import { NotificationEntityBuilder } from '../../../entity-builders/notification.entity.builder.js'
import { UserNotificationEntityBuilder } from '../../../entity-builders/user-notification.entity.builder.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'

describe('Mark notification as read e2e test', () => {
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

  it('should register the readAt of a user notification', async () => {
    const notification = new NotificationEntityBuilder()
      .withType(NotificationType.USER_CREATED)
      .withCreatedByUserUuid(adminUser.user.uuid)
      .build()

    const userNotification = new UserNotificationEntityBuilder()
      .withUserUuid(adminUser.user.uuid)
      .withNotificationUuid(notification.uuid)
      .withChannel(NotificationChannel.APP)
      .withReadAt(new Date())
      .build()

    await dataSource.manager.insert(Notification, notification)
    await dataSource.manager.insert(UserNotification, userNotification)

    const response = await request(app.getHttpServer())
      .patch(`/me/notifications/${notification.uuid}/mark-as-read`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(204)

    const updatedUserNotification = await dataSource.manager.findOne(UserNotification, {
      where: {
        notificationUuid: notification.uuid,
        userUuid: adminUser.user.uuid,
        channel: NotificationChannel.APP
      }
    })

    expect(updatedUserNotification?.readAt).not.toBe(null)
  })
})
