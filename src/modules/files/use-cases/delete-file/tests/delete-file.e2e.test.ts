import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { DataSource } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestAuthContext } from '../../../../../../test/utils/test-auth-context.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { FileSeeder } from '../../../tests/seeders/file.seeder.js'
import { FileEntityBuilder } from '../../../tests/builders/entities/file-entity.builder.js'

describe('Delete file end to end tests', () => {
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

  it('should delete file', async () => {
    const file = await new FileSeeder(dataSource.manager).seedOne(
      new FileEntityBuilder()
        .withUserUuid(adminUser.user.uuid)
        .build()
    )

    const response = await request(setup.httpServer)
      .delete(`/files/${file.uuid}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
