import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TestUser } from '../../../../users/tests/setup-user.type.js'
import { CreateContactCommandBuilder } from '../create-contact.command.builder.js'

describe('Create contact e2e tests', () => {
  let testSetup: EndToEndTestSetup
  let adminUser: TestUser

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    adminUser = await testSetup.authContext.getAdminUser()
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('Creates a new contact successfully', async () => {
    const command = new CreateContactCommandBuilder().build()

    const response = await request(testSetup.app.getHttpServer())
      .post(`/contacts`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(201)
    expect(response.body).toStrictEqual(expect.objectContaining({
      uuid: expect.uuid()
    }))
  })
})
