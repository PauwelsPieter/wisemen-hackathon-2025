import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { Notification } from '../../../entities/notification.entity.js'
import { UserNotification } from '../../../entities/user-notification.entity.js'
import { NotificationEntityBuilder } from '../../../entity-builders/notification.entity.builder.js'
import { UserNotificationEntityBuilder } from '../../../entity-builders/user-notification.entity.builder.js'

describe('View unread notifications count e2e test', () => {
  let setup: EndToEndTestSetup
  let adminUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    adminUser = await setup.authContext.getAdminUser()
  })

  after(async () => {
    await setup.teardown()
  })

  it('returns the amount of unread notifications', async () => {
    const notification1 = new NotificationEntityBuilder().build()
    const unreadNotification = new UserNotificationEntityBuilder()
      .withChannel(NotificationChannel.APP)
      .withNotificationUuid(notification1.uuid)
      .withUserUuid(adminUser.user.uuid)
      .withReadAt(null)
      .build()

    const notification2 = new NotificationEntityBuilder().build()
    const readNotification = new UserNotificationEntityBuilder()
      .withChannel(NotificationChannel.APP)
      .withNotificationUuid(notification2.uuid)
      .withUserUuid(adminUser.user.uuid)
      .withReadAt(new Date())
      .build()

    await setup.entityManager.insert(Notification, [notification1, notification2])
    await setup.entityManager.insert(UserNotification, [unreadNotification, readNotification])

    const response = await request(setup.httpServer)
      .get(`/me/notifications/unread-count`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
    expect(response.body).toStrictEqual(expect.objectContaining({
      amount: 1,
      exceedsLimit: false
    }))
  })
})
