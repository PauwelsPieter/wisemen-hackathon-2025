import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource } from 'typeorm'
import type { Role } from '../../entities/role.entity.js'
import { TestAuthContext } from '../../../../../test/utils/test-auth-context.js'
import type { TestUser } from '../../../users/tests/setup-user.type.js'
import { RoleSeeder } from '../../tests/seeders/role.seeder.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'
import { RoleEntityBuilder } from '../../tests/builders/entities/role-entity.builder.js'
import { UpdateRoleCommandBuilder } from './update-role-command.builder.js'

describe('Update role end to end tests', () => {
  let setup: EndToEndTestSetup
  let dataSource: DataSource

  let context: TestAuthContext

  let defaultRole: Role

  let adminUser: TestUser
  let defaultUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    context = setup.authContext
    dataSource = setup.dataSource
    defaultRole = await context.getDefaultRole()

    adminUser = await context.getAdminUser()
    defaultUser = await context.getDefaultUser()
  })

  after(async () => await setup.teardown())

  describe('Update role', () => {
    it('should return 401 when not authenticated', async () => {
      const command = new UpdateRoleCommandBuilder().build()

      const response = await request(setup.httpServer)
        .post(`/roles/${defaultRole.uuid}`)
        .send(command)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const roleDto = new UpdateRoleCommandBuilder().build()

      const response = await request(setup.httpServer)
        .post(`/roles/${defaultRole.uuid}`)
        .set('Authorization', `Bearer ${defaultUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(403)
    })

    it('should update role', async () => {
      const role = await new RoleSeeder(dataSource.manager).seedOne(
        new RoleEntityBuilder()
          .withName('should-update-role')
          .build()
      )

      const command = new UpdateRoleCommandBuilder()
        .withName('should-update-role-test')
        .build()

      const response = await request(setup.httpServer)
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(command)

      expect(response).toHaveStatus(201)
      expect(response.body.name).not.toBe(role.name)
    })

    it('should not update role with invalid name', async () => {
      const command = new UpdateRoleCommandBuilder()
        .withName('')
        .build()

      const response = await request(setup.httpServer)
        .post(`/roles/${defaultRole.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(command)

      expect(response).toHaveStatus(400)
    })
  })
})
