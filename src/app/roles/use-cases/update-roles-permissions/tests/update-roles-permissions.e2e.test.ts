import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { HttpStatus } from '@nestjs/common'
import { Role } from '../../../entities/role.entity.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { RoleEntityBuilder } from '../../../tests/builders/entities/role-entity.builder.js'
import { UpdateRolesPermissionsCommandBuilder } from './update-roles-permissions.command.builder.js'

describe('Update roles permissions e2e test', () => {
  let setup: EndToEndTestSetup
  let token: string

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    token = (await setup.authContext.getAdminUser()).token
  })

  after(async () => await setup.teardown())

  it('Updates the permissions of  roles', async () => {
    const role = new RoleEntityBuilder().build()

    await setup.dataSource.manager.insert(Role, role)

    const command = new UpdateRolesPermissionsCommandBuilder()
      .addRole(role.uuid, [])
      .build()

    const response = await request(setup.httpServer)
      .patch(`/roles`)
      .set('Authorization', `Bearer ${token}`)
      .send(command)

    expect(response).toHaveStatus(HttpStatus.NO_CONTENT)
  })
})
