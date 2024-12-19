import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { setupTest } from '../../../../../test/setup/test-setup.js'
import { Permission } from '../../../permission/permission.enum.js'
import { Theme } from '../../types/theme.enum.js'
import { Preferences } from '../../entities/preferences.entity.js'
import { UpdatePreferencesModule } from './update-preferences.module.js'

describe('Update preferences e2e', () => {
  let app: NestExpressApplication
  let dataSource: DataSource
  let context: TestContext

  let user: TestUser

  before(async () => {
    ({ app, dataSource, context } = await setupTest([UpdatePreferencesModule]))

    user = await context.getUser([Permission.READ_ONLY])
  })

  after(async () => {
    await app.close()
  })

  describe('Update preferences', () => {
    it('should return 401 when updating preferences without a token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${user.user.uuid}/preferences`)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when updating someone elses preferences', async () => {
      const someone = await context.getUser([Permission.READ_ONLY])

      const response = await request(app.getHttpServer())
        .patch(`/users/${someone.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 200 when updating own preferences', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${user.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return 200 when updating perferences multiple times', async () => {
      const response1 = await request(app.getHttpServer())
        .patch(`/users/${user.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          theme: Theme.DARK
        })

      expect(response1).toHaveStatus(200)

      let preferences = await dataSource.getRepository(Preferences).findOneOrFail({
        where: {
          userUuid: user.user.uuid
        }
      })

      expect(preferences.theme).toEqual(Theme.DARK)

      const response2 = await request(app.getHttpServer())
        .patch(`/users/${user.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          reduceMotion: true
        })

      expect(response2).toHaveStatus(200)

      preferences = await dataSource.getRepository(Preferences).findOneOrFail({
        where: {
          userUuid: user.user.uuid
        }
      })

      expect(preferences.theme).toEqual(Theme.DARK)
      expect(preferences.reduceMotion).toEqual(true)
    })
  })
})
