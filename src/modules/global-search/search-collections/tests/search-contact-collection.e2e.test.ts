// import { after, before, describe, it } from 'node:test'
// import request from 'supertest'
// import { expect } from 'expect'
// import { stringify } from 'qs'
// import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
// import { TestBench } from '../../../../../test/setup/test-bench.js'
// import { TypesenseCollectionName } from '../../../typesense/collections/typesense-collection-name.enum.js'
// import { TypesenseCollectionService } from '../../../typesense/services/typesense-collection.service.js'
// import { SearchCollectionsQueryBuilder } from '../query/search-collections.query-builder.js'
// import { MigrateCollectionsUseCase } from '../../../typesense/use-cases/migrate-collections/migrate-collections.use-case.js'
// import { ContactEntityBuilder } from '../../../../app/contact/entities/contact.entity.builder.js'

// describe('Search contact collections e2e test', () => {
//   let setup: EndToEndTestSetup
//   let typesense: TypesenseCollectionService
//   let token: string

//   before(async () => {
//     setup = await TestBench.setupEndToEndTest()
//     token = (await setup.authContext.getAdminUser()).token

//     typesense = setup.testModule.get(TypesenseCollectionService, { strict: false })
//     const migrator = setup.testModule.get(MigrateCollectionsUseCase, { strict: false })
//     await migrator.execute(true, [TypesenseCollectionName.CONTACT])
//   })

//   after(async () => await setup.teardown())

//   it('returns the contact based on name', async () => {
//     const contact = new ContactEntityBuilder()
//       .withFirstName('Wisemen')
//       .build()

//     await typesense.importManually(TypesenseCollectionName.CONTACT, [contact])

//     const query = new SearchCollectionsQueryBuilder()
//       .withSearch('Wisemen')
//       .withFilterOn([TypesenseCollectionName.CONTACT])
//       .build()

//     const response = await request(setup.app.getHttpServer())
//       .get('/search')
//       .set('Authorization', `Bearer ${token}`)
//       .query(stringify(query))

//     expect(response).toHaveStatus(200)
//     expect(response.body.items).toHaveLength(1)
//     expect(response.body.items[0].entity.uuid).toEqual(contact.uuid)
//   })

//   it('filters contact on is active', async () => {
//     const migrator = setup.testModule.get(MigrateCollectionsUseCase, { strict: false })
//     await migrator.execute(true, [TypesenseCollectionName.CONTACT])

//     const contacts = [
//       new ContactEntityBuilder()
//         .withFirstName('Wisemen')
//         .withIsActive(true)
//         .build(),
//       new ContactEntityBuilder()
//         .withFirstName('Wisemen 2')
//         .withIsActive(false)
//         .build()
//     ]

//     await typesense.importManually(TypesenseCollectionName.CONTACT, contacts)

//     const query = new SearchCollectionsQueryBuilder()
//       .withSearch('Wisemen')
//       .withFilterOn([TypesenseCollectionName.CONTACT])
//       .withContactActive(true)
//       .build()

//     const response = await request(setup.app.getHttpServer())
//       .get('/search')
//       .set('Authorization', `Bearer ${token}`)
//       .query(stringify(query))

//     expect(response).toHaveStatus(200)
//     expect(response.body.items).toStrictEqual([
//       expect.objectContaining({
//         entity: expect.objectContaining({ uuid: contacts[0].uuid })
//       })
//     ])
//   })
// })
