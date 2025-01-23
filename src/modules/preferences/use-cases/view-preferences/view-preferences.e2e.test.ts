import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { TestAuthContext } from '../../../../../test/utils/test-auth-context.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { Permission } from '../../../permission/permission.enum.js'
import { Theme } from '../../types/theme.enum.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'

describe('View preferences e2e', () => {
  let setup: EndToEndTestSetup
  let context: TestAuthContext
  let user: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    context = setup.authContext
    user = await context.getUser([Permission.READ_ONLY])
  })

  after(async () => await setup.teardown())

  describe('View preferences', () => {
    it('should return 401 when viewing preferences without a token', async () => {
      const response = await request(setup.httpServer)
        .get(`/users/${user.user.uuid}/preferences`)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 for someone elses preferences', async () => {
      const someone = await context.getUser([Permission.READ_ONLY])

      const response = await request(setup.httpServer)
        .get(`/users/${someone.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 200 for own preferences', async () => {
      const response = await request(setup.httpServer)
        .get(`/users/${user.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(200)
      expect(response.body).toEqual({
        theme: Theme.SYSTEM,
        language: null,
        fontSize: null,
        showShortcuts: false,
        reduceMotion: false,
        highContrast: false
      })
    })
  })
})
