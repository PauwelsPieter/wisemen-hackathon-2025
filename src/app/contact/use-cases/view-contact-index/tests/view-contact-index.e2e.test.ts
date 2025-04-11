import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { stringify } from 'qs'
import { expect } from 'expect'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TypesenseCollectionName } from '../../../../../modules/typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../../../../modules/typesense/services/typesense-collection.service.js'
import { TypesenseInitializationService } from '../../../../../modules/typesense/services/typesense-initialization.service.js'
import { TestUser } from '../../../../users/tests/setup-user.type.js'
import { ContactEntityBuilder } from '../../../entities/contact.entity.builder.js'
import { ViewContactIndexQueryBuilder } from '../query/view-contact-index.query.builder.js'

describe('View contact index e2e tests', () => {
  let testSetup: EndToEndTestSetup
  let adminUser: TestUser
  let typesenseCollectionService: TypesenseCollectionService

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    adminUser = await testSetup.authContext.getAdminUser()

    const typesenseInitializationService = testSetup.testModule.get(TypesenseInitializationService)
    await typesenseInitializationService.migrate(true, [TypesenseCollectionName.CONTACT])

    typesenseCollectionService = testSetup.testModule.get(
      TypesenseCollectionService, { strict: false })
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('Retrieves contacts successfully', async () => {
    const findableContact = new ContactEntityBuilder()
      .withFirstName('Jonas')
      .build()
    const unfindableByNameContact = new ContactEntityBuilder()
      .withFirstName('John')
      .build()
    const unfindableByIsActiveContact = new ContactEntityBuilder()
      .withIsActive(false)
      .build()

    await typesenseCollectionService.importManually(
      TypesenseCollectionName.CONTACT,
      [
        findableContact,
        unfindableByNameContact,
        unfindableByIsActiveContact
      ]
    )

    const query = new ViewContactIndexQueryBuilder()
      .withSearch('Jonas')
      .withFilter({
        isActive: 'true'
      })
      .build()

    const response = await request(testSetup.app.getHttpServer())
      .get(`/contacts`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body).toStrictEqual(expect.objectContaining({
      items: [expect.objectContaining({
        uuid: findableContact.uuid
      })],
      meta: expect.objectContaining({
        total: 1,
        limit: 10,
        offset: 0
      })
    }))
  })
})
