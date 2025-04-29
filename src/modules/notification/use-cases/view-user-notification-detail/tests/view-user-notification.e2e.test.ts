import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { NotificationEntityBuilder } from '../../../entity-builders/notification.entity.builder.js'
import { UserNotificationEntityBuilder } from '../../../entity-builders/user-notification.entity.builder.js'
import { Notification } from '../../../entities/notification.entity.js'
import { UserNotification } from '../../../entities/user-notification.entity.js'

describe('View user notification detail e2e tests', () => {
  let setup: EndToEndTestSetup
  let adminUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    adminUser = await setup.authContext.getAdminUser()
  })

  after(async () => await setup.teardown())

  it('returns the notification details', async () => {
    const notification = new NotificationEntityBuilder().build()
    const userNotification = new UserNotificationEntityBuilder()
      .withChannel(NotificationChannel.APP)
      .withNotificationUuid(notification.uuid)
      .withUserUuid(adminUser.user.uuid)
      .build()

    await setup.entityManager.insert(Notification, notification)
    await setup.entityManager.insert(UserNotification, userNotification)

    const response = await request(setup.httpServer)
      .get(`/me/notifications/${notification.uuid}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
    expect(response.body).toStrictEqual(expect.objectContaining({
      notificationUuid: notification.uuid
    }))
  })
})
