import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { DataSource } from 'typeorm'
import { TestAuthContext } from '../../../../../test/utils/test-auth-context.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { Theme } from '../../types/theme.enum.js'
import { Preferences } from '../../entities/preferences.entity.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'

describe('Update preferences e2e', () => {
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
        .patch(`/users/${user.user.uuid}/preferences`)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when updating someone elses preferences', async () => {
      const someone = await context.getUser([])

      const response = await request(setup.httpServer)
        .patch(`/users/${someone.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 200 when updating own preferences', async () => {
      const response = await request(setup.httpServer)
        .patch(`/users/${user.user.uuid}/preferences`)
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return 200 when updating perferences multiple times', async () => {
      const response1 = await request(setup.httpServer)
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

      const response2 = await request(setup.httpServer)
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
