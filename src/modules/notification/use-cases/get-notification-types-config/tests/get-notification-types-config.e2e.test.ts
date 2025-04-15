import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'

describe('Get notification types config e2e test', () => {
  let testSetup: EndToEndTestSetup
  let app: NestExpressApplication
  let adminUser: TestUser

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    app = testSetup.app

    adminUser = await testSetup.authContext.getAdminUser()
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('returns notification types config', async () => {
    const response = await request(app.getHttpServer())
      .get(`/notification-preferences/config`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
    expect(response.body.items).toStrictEqual(expect.arrayContaining([
      {
        type: NotificationType.USER_CREATED,
        channelConfigs: expect.arrayContaining([
          {
            channel: NotificationChannel.APP,
            defaultValue: true,
            isSupported: true
          },
          {
            channel: NotificationChannel.EMAIL,
            defaultValue: false,
            isSupported: false
          },
          {
            channel: NotificationChannel.SMS,
            defaultValue: false,
            isSupported: false
          },
          {
            channel: NotificationChannel.PUSH,
            defaultValue: false,
            isSupported: false
          }
        ])
      }
    ]))
  })
})
