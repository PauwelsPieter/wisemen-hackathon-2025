import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import request from 'supertest'
import { expect } from 'expect'
import type { TestUser } from '../../tests/setup-user.type.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'

describe('View user detail e2e test', () => {
  let setup: EndToEndTestSetup
  let adminUser: TestUser
  let authorizedUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()

    const [admin, user] = await Promise.all([
      setup.authContext.getAdminUser(),
      setup.authContext.getUser([])
    ])

    adminUser = admin
    authorizedUser = user
  })

  after(async () => await setup.teardown())

  it('returns 401 when not authenticated', async () => {
    const response = await request(setup.httpServer)
      .get(`/users/${authorizedUser.user.uuid}`)

    expect(response).toHaveStatus(401)
  })

  it('returns 404 when the user does not exist', async () => {
    const response = await request(setup.httpServer)
      .get(`/users/${randomUUID()}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(404)
  })

  it('returns 403 (unauthorized) when a user attempts to view another user', async () => {
    const response = await request(setup.httpServer)
      .get(`/users/${adminUser.user.uuid}`)
      .set('Authorization', `Bearer ${authorizedUser.token}`)

    expect(response).toHaveStatus(403)
  })

  it('an admin can view any user', async () => {
    const response = await request(setup.httpServer)
      .get(`/users/${authorizedUser.user.uuid}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
