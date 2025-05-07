import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { stringify } from 'qs'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'
import { TestUser } from '../../../../app/users/tests/setup-user.type.js'
import { TypesenseCollectionName } from '../../../typesense/collections/typesense-collection-name.enum.js'
import { TypesenseCollectionService } from '../../../typesense/services/typesense-collection.service.js'
import { SearchCollectionsQueryBuilder } from '../query/search-collections.query-builder.js'
import { User } from '../../../../app/users/entities/user.entity.js'
import { UserEntityBuilder } from '../../../../app/users/tests/user-entity.builder.js'

describe('Search collections e2e test', () => {
  let setup: EndToEndTestSetup
  let adminUser: TestUser
  let typesense: TypesenseCollectionService
  let user1: User
  let user2: User

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    adminUser = await setup.authContext.getAdminUser()
    typesense = setup.testModule.get(TypesenseCollectionService, { strict: false })

    user1 = new UserEntityBuilder()
      .withFirstName('Test')
      .withLastName('1')
      .build()

    user2 = new UserEntityBuilder()
      .withFirstName('Frank')
      .withLastName('De Tester')
      .build()

    const user3 = new UserEntityBuilder()
      .withFirstName('User')
      .withLastName('3')
      .build()

    await typesense.importManually(
      TypesenseCollectionName.USER,
      [user1, user2, user3]
    )
  })

  after(async () => {
    await setup.teardown()
  })

  it('returns the searched collection ordered on text score', async () => {
    const query = new SearchCollectionsQueryBuilder()
      .withSearch('Test')
      .withFilterOn([
        TypesenseCollectionName.USER
      ])
      .build()

    const response = await request(setup.app.getHttpServer())
      .get('/search')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body.items).toHaveLength(2)
    expect(response.body.items[0].entity.uuid).toEqual(user1.uuid)
    expect(response.body.items[0].collection).toEqual(TypesenseCollectionName.USER)
    expect(response.body.items[1].entity.uuid).toEqual(user2.uuid)
    expect(response.body.items[1].collection).toEqual(TypesenseCollectionName.USER)
  })

  it('returns search results of all collections when not filtered', async () => {
    const query = new SearchCollectionsQueryBuilder()
      .withSearch('Test')
      .build()

    const response = await request(setup.app.getHttpServer())
      .get('/search')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body.items).toHaveLength(2)
    expect(response.body.items[0].entity.uuid).toEqual(user1.uuid)
    expect(response.body.items[0].collection).toEqual(TypesenseCollectionName.USER)
    expect(response.body.items[1].entity.uuid).toEqual(user2.uuid)
    expect(response.body.items[1].collection).toEqual(TypesenseCollectionName.USER)
  })
})
