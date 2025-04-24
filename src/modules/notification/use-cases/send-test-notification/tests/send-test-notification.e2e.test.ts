import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { SendTestNotificationCommand } from '../send-test-notification.command.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'

describe('Send test notification e2e test', () => {
  let setup: EndToEndTestSetup
  let adminUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    adminUser = await setup.authContext.getAdminUser()
  })

  after(async () => {
    await setup.teardown()
  })

  it('sends a test notification', async () => {
    const command: SendTestNotificationCommand = {
      message: 'test'
    }

    const response = await request(setup.httpServer)
      .post(`/notifications/test-notification`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(204)
  })
})
