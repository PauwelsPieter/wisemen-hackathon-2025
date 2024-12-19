import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { setupTest } from '../../../../../test/setup/test-setup.js'
import { Permission } from '../../../permission/permission.enum.js'
import { Theme } from '../../types/theme.enum.js'
import { ViewPreferencesModule } from './view-preferences.module.js'

describe('View preferences e2e', () => {
  let app: NestExpressApplication

  let context: TestContext

  let user: TestUser

  before(async () => {
    ({ app, context } = await setupTest([ViewPreferencesModule]))

    user = await context.getUser([Permission.READ_ONLY])
  })

  after(async () => {
    await app.close()
  })

  describe('View preferences', () => {
    it('should return 401 when viewing preferences without a token', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${user.user.uuid}/preferences`)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 for someone elses preferences', async () => {
      const someone = await context.getUser([Permission.READ_ONLY])

      const response = await request(app.getHttpServer())
        .get(`/users/${someone.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 200 for own preferences', async () => {
      const response = await request(app.getHttpServer())
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
