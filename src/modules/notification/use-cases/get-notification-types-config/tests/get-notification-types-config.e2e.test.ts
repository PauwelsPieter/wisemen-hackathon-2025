import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
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
    expect(response.body.groups).toStrictEqual(expect.arrayContaining([
      {
        name: expect.any(String),
        description: expect.any(String),
        types: expect.arrayContaining([{
          key: expect.any(String),
          description: expect.any(String),
          channelConfigs: expect.arrayContaining([{
            channel: expect.isEnumValue(NotificationChannel),
            defaultValue: expect.any(Boolean),
            isSupported: expect.any(Boolean)
          }])
        }])
      }
    ]))
  })
})
