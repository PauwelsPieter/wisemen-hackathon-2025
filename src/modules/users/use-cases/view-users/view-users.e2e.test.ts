import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TestingModule } from '@nestjs/testing'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Permission } from '../../../permission/permission.enum.js'
import type { TestUser } from '../../tests/setup-user.type.js'
import { setupTest } from '../../../../../test/setup/test-setup.js'
import {
  TypesenseCollectionService
} from '../../../typesense/services/typesense-collection.service.js'
import {
  TypesenseCollectionName
} from '../../../typesense/enums/typesense-collection-index.enum.js'
import { ViewUsersModule } from './view-users.module.js'

describe('View users e2e test', () => {
  let app: NestExpressApplication
  let testModule: TestingModule
  let context: TestContext
  let adminUser: TestUser
  let readonlyUser: TestUser
  let userWithUserDeletePermission: TestUser

  before(async () => {
    ({ app, context, testModule } = await setupTest([ViewUsersModule]))

    readonlyUser = await context.getReadonlyUser()
    adminUser = await context.getAdminUser()

    userWithUserDeletePermission = await context.getUser([Permission.USER_DELETE])

    const typesenseCollectionService = testModule.get(TypesenseCollectionService)

    await typesenseCollectionService.importManuallyToTypesense(
      TypesenseCollectionName.USER,
      [adminUser.user, readonlyUser.user, userWithUserDeletePermission.user]
    )
  })

  after(async () => {
    await app.close()
  })

  it('returns 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')

    expect(response).toHaveStatus(401)
  })

  it('returns users in a paginated format', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query({
        'pagination': {
          limit: 10,
          offset: 0
        },
        'filter[permissions][0]': Permission.USER_DELETE
      })

    expect(response).toHaveStatus(200)
    expect(response.body).toStrictEqual(expect.objectContaining({
      items: [expect.objectContaining({
        email: userWithUserDeletePermission.user.email,
        firstName: userWithUserDeletePermission.user.firstName,
        lastName: userWithUserDeletePermission.user.lastName,
        uuid: userWithUserDeletePermission.user.uuid
      })],
      meta: {
        total: 1,
        offset: 0,
        limit: 10
      }
    }))
  })
})
