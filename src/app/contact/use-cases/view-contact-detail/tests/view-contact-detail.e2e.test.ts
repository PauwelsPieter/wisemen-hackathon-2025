import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TestUser } from '../../../../users/tests/setup-user.type.js'
import { ContactEntityBuilder } from '../../../entities/contact.entity.builder.js'
import { Contact } from '../../../entities/contact.entity.js'

describe('view contact detail e2e tests', () => {
  let testSetup: EndToEndTestSetup
  let adminUser: TestUser
  let contact: Contact

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    adminUser = await testSetup.authContext.getAdminUser()

    contact = new ContactEntityBuilder()
      .build()

    await testSetup.dataSource.manager.insert(Contact, contact)
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('retrieves a contact successfully', async () => {
    const response = await request(testSetup.app.getHttpServer())
      .get(`/contacts/${contact.uuid}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
    expect(response.body.uuid).toStrictEqual(contact.uuid)
  })
})
