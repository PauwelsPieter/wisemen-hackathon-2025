import { after, before, describe, it } from 'node:test'
import { stringify } from 'qs'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { Notification } from '../../../entities/notification.entity.js'
import { UserNotification } from '../../../entities/user-notification.entity.js'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { GetMyNotificationsQueryBuilder } from '../query/get-my-notifications.query-builder.js'
import { NotificationEntityBuilder } from '../../../entity-builders/notification.entity.builder.js'
import { UserNotificationEntityBuilder } from '../../../entity-builders/user-notification.entity.builder.js'
import { GetMyNotificationsQueryKey } from '../query/get-my-notifications.query.key.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { UserEntityBuilder } from '../../../../../app/users/tests/user-entity.builder.js'
import { User } from '../../../../../app/users/entities/user.entity.js'

describe('Get my notifications e2e test', () => {
  let testSetup: EndToEndTestSetup
  let app: NestExpressApplication
  let dataSource: DataSource
  let adminUser: TestUser

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    dataSource = testSetup.dataSource
    app = testSetup.app

    adminUser = await testSetup.authContext.getAdminUser()

    const user = new UserEntityBuilder().withEmail('user1@email.com').build()

    const notificationUser1 = new NotificationEntityBuilder()
      .withType(NotificationType.USER_CREATED)
      .withMeta({ userName: 'John Doe' })
      .withCreatedByUserUuid(user.uuid)
      .build()

    const notification1Admin = new NotificationEntityBuilder()
      .withType(NotificationType.USER_CREATED)
      .withMeta({ userName: 'John Doe' })
      .withCreatedByUserUuid(adminUser.user.uuid)
      .build()

    const notification2Admin = new NotificationEntityBuilder()
      .withType(NotificationType.USER_CREATED)
      .withMeta({ userName: 'John Doe' })
      .withCreatedByUserUuid(adminUser.user.uuid)
      .build()

    const user1Notification = new UserNotificationEntityBuilder()
      .withUserUuid(user.uuid)
      .withNotificationUuid(notificationUser1.uuid)
      .withChannel(NotificationChannel.APP)
      .build()

    const adminUserNotification1 = new UserNotificationEntityBuilder()
      .withUserUuid(adminUser.user.uuid)
      .withNotificationUuid(notification1Admin.uuid)
      .withChannel(NotificationChannel.APP)
      .withReadAt(new Date())
      .build()

    const adminUserNotification2 = new UserNotificationEntityBuilder()
      .withUserUuid(adminUser.user.uuid)
      .withNotificationUuid(notification2Admin.uuid)
      .withChannel(NotificationChannel.APP)
      .withReadAt(null)
      .build()

    await dataSource.manager.insert(User, user)
    await dataSource.manager.insert(Notification, [
      notificationUser1, notification1Admin, notification2Admin
    ])
    await dataSource.manager.insert(UserNotification, [
      user1Notification, adminUserNotification1, adminUserNotification2
    ])
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('returns notifications', async () => {
    const query = new GetMyNotificationsQueryBuilder().build()

    const response = await request(app.getHttpServer())
      .get(`/me/notifications`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body.items).toHaveLength(2)
  })

  it('returns the next notification when using the next key', async () => {
    const firstQuery = new GetMyNotificationsQueryBuilder()
      .withLimit(1)
      .build()

    const firstResponse = await request(app.getHttpServer())
      .get(`/me/notifications`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query(stringify(firstQuery))

    expect(firstResponse).toHaveStatus(200)
    expect(firstResponse.body.items).toHaveLength(1)

    const secondQuery = new GetMyNotificationsQueryBuilder()
      .withKey(firstResponse.body.meta.key as GetMyNotificationsQueryKey)
      .withLimit(1)
      .build()

    const secondResponse = await request(app.getHttpServer())
      .get(`/me/notifications`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query(stringify(secondQuery))

    expect(secondResponse).toHaveStatus(200)
    expect(secondResponse.body.items).toHaveLength(1)
  })

  it('returns notifications with filtered on onlyUnread', async () => {
    const query = new GetMyNotificationsQueryBuilder()
      .withOnlyUnread(true)
      .build()

    await expect(query).not.toHaveValidationErrors()

    const response = await request(app.getHttpServer())
      .get(`/me/notifications`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body.items).toHaveLength(1)
  })
})
