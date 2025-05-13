import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { TestUser } from '../../tests/setup-user.type.js'
import { TypesenseCollectionService } from '../../../../modules/typesense/services/typesense-collection.service.js'
import { TypesenseCollectionName } from '../../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { MigrateCollectionsUseCase } from '../../../../modules/typesense/use-cases/migrate-collections/migrate-collections.use-case.js'

describe('View user index e2e test', () => {
  let setup: EndToEndTestSetup
  let adminUser: TestUser
  let defaultUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()

    defaultUser = await setup.authContext.getDefaultUser()
    adminUser = await setup.authContext.getAdminUser()

    const typesenseCollectionService = setup.testModule.get(TypesenseCollectionService)

    const typesenseMigrator = setup.testModule.get(MigrateCollectionsUseCase, { strict: false })
    await typesenseMigrator.execute(true, [TypesenseCollectionName.USER])

    // wait for fix in v29 of typesense to use truncate instead of remigrate
    // await typesenseCollectionService.truncate([TypesenseCollectionName.USER])

    await typesenseCollectionService.importManually(
      TypesenseCollectionName.USER,
      [adminUser.user, defaultUser.user]
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
        pagination: {
          limit: 10,
          offset: 0
        }
      })

    expect(response).toHaveStatus(200)
    expect(response.body.items).toHaveLength(2)
  })

  it('includes user roles', async () => {
    const response = await request(setup.httpServer)
      .get('/users')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query({
        pagination: {
          limit: 10,
          offset: 0
        }
      })

    expect(response).toHaveStatus(200)
    expect(response.body.items).toStrictEqual(expect.arrayContaining([
      expect.objectContaining({
        roles: expect.arrayContaining([{
          uuid: defaultUser.user.userRoles![0].role!.uuid,
          name: defaultUser.user.userRoles![0].role!.name
        }])
      })
    ]))
  })
})
