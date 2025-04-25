import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { DataSource } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestAuthContext } from '../../../../../../test/utils/test-auth-context.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { FileEntityBuilder } from '../../../entities/file-entity.builder.js'
import { File } from '../../../entities/file.entity.js'

describe('Confirm file upload end to end tests', () => {
  let setup: EndToEndTestSetup
  let dataSource: DataSource
  let context: TestAuthContext
  let adminUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    dataSource = setup.dataSource
    context = setup.authContext

    adminUser = await context.getAdminUser()
  })

  after(async () => await setup.teardown())

  it('marks a file as uploaded', async () => {
    const file = new FileEntityBuilder().build()
    await dataSource.manager.insert(File, file)

    const response = await request(setup.httpServer)
      .post(`/files/${file.uuid}/confirm-upload`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
