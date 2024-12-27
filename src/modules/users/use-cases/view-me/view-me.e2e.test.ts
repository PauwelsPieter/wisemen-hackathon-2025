import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Permission } from '../../../permission/permission.enum.js'
import type { TestUser } from '../../tests/setup-user.type.js'
import { setupTest } from '../../../../../test/setup/test-setup.js'
import { ViewMeModule } from './view-me.module.js'

describe('View me e2e test', () => {
  let app: NestExpressApplication
  let authorizedUser: TestUser
  let context: TestContext

  before(async () => {
    ({ app, context } = await setupTest([ViewMeModule]))

    const user = await context.getUser([Permission.USER_READ])

    authorizedUser = user
  })

  after(async () => {
    await app.close()
  })

  it('returns 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/me`)

    expect(response).toHaveStatus(401)
  })

  it('returns user data about themselves', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/me`)
      .set('Authorization', `Bearer ${authorizedUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
