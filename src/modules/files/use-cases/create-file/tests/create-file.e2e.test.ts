import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { TestAuthContext } from '../../../../../../test/utils/test-auth-context.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { CreateFileCommandBuilder } from './create-file.command.builder.js'

describe('Create file end to end tests', () => {
  let setup: EndToEndTestSetup
  let context: TestAuthContext
  let adminUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    context = setup.authContext

    adminUser = await context.getAdminUser()
  })

  after(async () => await setup.teardown())

  it('should create file', async () => {
    const command = new CreateFileCommandBuilder().build()

    const response = await request(setup.httpServer)
      .post('/files')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(201)
  })
})
