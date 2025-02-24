import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import type { TestUser } from '../../tests/setup-user.type.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'

describe('View me e2e test', () => {
  let setup: EndToEndTestSetup
  let authorizedUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()

    const user = await setup.authContext.getUser([Permission.USER_READ])

    authorizedUser = user
  })

  after(async () => await setup.teardown())

  it('returns 401 when not authenticated', async () => {
    const response = await request(setup.httpServer)
      .get(`/users/me`)

    expect(response).toHaveStatus(401)
  })

  it('returns user data about themselves', async () => {
    const response = await request(setup.httpServer)
      .get(`/users/me`)
      .set('Authorization', `Bearer ${authorizedUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
