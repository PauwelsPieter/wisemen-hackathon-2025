import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { DataSource } from 'typeorm'
import { TestAuthContext } from '../../../../../test/utils/test-auth-context.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { UiTheme } from '../../enums/theme.enum.js'
import { UiPreferences } from '../../entities/ui-preferences.entity.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'

describe('Update ui preferences e2e', () => {
  let setup: EndToEndTestSetup
  let dataSource: DataSource
  let context: TestAuthContext

  let user: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    dataSource = setup.dataSource
    context = setup.authContext

    user = await context.getUser([])
  })

  after(async () => await setup.teardown())

  describe('Update preferences', () => {
    it('should return 401 when updating preferences without a token', async () => {
      const response = await request(setup.httpServer)
        .patch('/me/ui-preferences')

      expect(response).toHaveStatus(401)
    })

    it('should return 200 when updating own preferences', async () => {
      const response = await request(setup.httpServer)
        .patch('/me/ui-preferences')
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return 200 when updating perferences multiple times', async () => {
      const response1 = await request(setup.httpServer)
        .patch('/me/ui-preferences')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          theme: UiTheme.DARK
        })

      expect(response1).toHaveStatus(200)

      let preferences = await dataSource.getRepository(UiPreferences).findOneOrFail({
        where: {
          userUuid: user.user.uuid
        }
      })

      expect(preferences.theme).toEqual(UiTheme.DARK)

      const response2 = await request(setup.httpServer)
        .patch('/me/ui-preferences')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          reduceMotion: true
        })

      expect(response2).toHaveStatus(200)

      preferences = await dataSource.getRepository(UiPreferences).findOneOrFail({
        where: {
          userUuid: user.user.uuid
        }
      })

      expect(preferences.theme).toEqual(UiTheme.DARK)
      expect(preferences.reduceMotion).toEqual(true)
    })
  })
})
