import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { Permission } from '../../../permission/permission.enum.js'
import type { TestUser } from '../../tests/setup-user.type.js'
import {
  TypesenseCollectionService
} from '../../../typesense/services/typesense-collection.service.js'
import {
  TypesenseCollectionName
} from '../../../typesense/enums/typesense-collection-index.enum.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'

describe('View users e2e test', () => {
  let setup: EndToEndTestSetup
  let adminUser: TestUser
  let readonlyUser: TestUser
  let userWithUserDeletePermission: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()

    readonlyUser = await setup.authContext.getReadonlyUser()
    adminUser = await setup.authContext.getAdminUser()

    userWithUserDeletePermission = await setup.authContext.getUser([Permission.USER_DELETE])

    const typesenseCollectionService = setup.testModule.get(TypesenseCollectionService)

    await typesenseCollectionService.importManually(
      TypesenseCollectionName.USER,
      [adminUser.user, readonlyUser.user, userWithUserDeletePermission.user]
    )
  })

  after(async () => await setup.teardown())

  it('returns 401 when not authenticated', async () => {
    const response = await request(setup.httpServer)
      .get('/users')

    expect(response).toHaveStatus(401)
  })

  it('returns users in a paginated format', async () => {
    const response = await request(setup.httpServer)
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
