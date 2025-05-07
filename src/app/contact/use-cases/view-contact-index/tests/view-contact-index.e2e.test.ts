import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { stringify } from 'qs'
import { expect } from 'expect'
import { SortDirection } from '@wisemen/pagination'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TypesenseCollectionName } from '../../../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { TypesenseCollectionService } from '../../../../../modules/typesense/services/typesense-collection.service.js'
import { TestUser } from '../../../../users/tests/setup-user.type.js'
import { ContactEntityBuilder } from '../../../entities/contact.entity.builder.js'
import { ViewContactIndexQueryBuilder } from '../query/view-contact-index.query.builder.js'
import { Contact } from '../../../entities/contact.entity.js'
import { ViewContactIndexSortQueryKey } from '../query/view-contact-index-sort.query.js'
import { MigrateCollectionsUseCase } from '../../../../../modules/typesense/use-cases/migrate-collections/migrate-collections.use-case.js'

describe('View contact index e2e tests', () => {
  let testSetup: EndToEndTestSetup
  let adminUser: TestUser
  let findableContact: Contact
  let unfindableByNameContact: Contact
  let unfindableByIsActiveContact: Contact

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    adminUser = await testSetup.authContext.getAdminUser()

    const typesenseMigrator = testSetup.testModule.get(MigrateCollectionsUseCase, { strict: false })
    await typesenseMigrator.execute(true, [TypesenseCollectionName.CONTACT])

    const typesenseCollectionService = testSetup.testModule.get(
      TypesenseCollectionService, { strict: false })

    findableContact = new ContactEntityBuilder()
      .withFirstName('Jonas')
      .build()
    unfindableByNameContact = new ContactEntityBuilder()
      .withFirstName('AAA')
      .build()
    unfindableByIsActiveContact = new ContactEntityBuilder()
      .withFirstName('BBB')
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
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('Retrieves contacts successfully when searched', async () => {
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

  it('Retrieves contacts successfully when sorted', async () => {
    const query = new ViewContactIndexQueryBuilder()
      .withSortOn(ViewContactIndexSortQueryKey.NAME, SortDirection.ASC)
      .build()

    const response = await request(testSetup.app.getHttpServer())
      .get(`/contacts`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body.items).toHaveLength(3)
    expect(response.body.items[0].uuid).toEqual(unfindableByNameContact.uuid)
    expect(response.body.items[1].uuid).toEqual(unfindableByIsActiveContact.uuid)
    expect(response.body.items[2].uuid).toEqual(findableContact.uuid)
  })
})
