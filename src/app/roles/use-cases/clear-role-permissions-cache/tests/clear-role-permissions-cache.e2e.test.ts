import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { TestUser } from '../../../../users/tests/setup-user.type.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'

describe('Clear role permissions cache end to end tests', () => {
  let setup: EndToEndTestSetup
  let adminUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    adminUser = await setup.authContext.getAdminUser()
  })

  after(async () => await setup.teardown())

  it('clears the role cache', async () => {
    const response = await request(setup.httpServer)
      .post('/roles/clear-cache')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({})

    expect(response).toHaveStatus(204)
  })
})
