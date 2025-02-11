import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource } from 'typeorm'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { TestAuthContext } from '../../../../../test/utils/test-auth-context.js'
import type { TestUser } from '../../../users/tests/setup-user.type.js'
import { RoleSeeder } from '../../tests/seeders/role.seeder.js'
import { UpdateRolesBulkCommandBuilder, UpdateRolesBulkRoleCommandBuilder, PermissionObjectBuilder } from '../../tests/builders/commands/update-roles-bulk-command.builder.js'
import { RoleEntityBuilder } from '../../tests/builders/entities/role-entity.builder.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'

describe('Roles', () => {
  let setup: EndToEndTestSetup
  let dataSource: DataSource
  let context: TestAuthContext
  let defaultRole: Role
  let adminUser: TestUser
  let defaultUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    dataSource = setup.dataSource
    context = setup.authContext
    defaultRole = await context.getDefaultRole()

    adminUser = await context.getAdminUser()
    defaultUser = await context.getDefaultUser()
  })

  after(async () => await setup.teardown())

  describe('Update role', () => {
    it('should return 401 when not authenticated', async () => {
      const roleDto = new UpdateRolesBulkCommandBuilder()
        .withUpdateRolesBulkRoleCommand(
          new UpdateRolesBulkRoleCommandBuilder()
            .withRoleUuid(defaultRole.uuid)
            .withName('should-update-role')
            .withPermissions([
              new PermissionObjectBuilder()
                .withId('admin')
                .build(),
              new PermissionObjectBuilder()
                .withId('role')
                .withActions(['create', 'read', 'update', 'delete'])
                .build()
            ])
            .build()
        )
        .build()

      const response = await request(setup.httpServer)
        .post(`/roles/bulk`)
        .send(roleDto)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const roleDto = new UpdateRolesBulkCommandBuilder()
        .withUpdateRolesBulkRoleCommand(
          new UpdateRolesBulkRoleCommandBuilder()
            .withRoleUuid(defaultRole.uuid)
            .withName('should-update-role')
            .withPermissions([
              new PermissionObjectBuilder()
                .withId('admin')
                .build(),
              new PermissionObjectBuilder()
                .withId('role')
                .withActions(['create', 'read', 'update', 'delete'])
                .build()
            ])
            .build()
        )
        .build()

      const response = await request(setup.httpServer)
        .post(`/roles/bulk`)
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

      const roleDto = new UpdateRolesBulkCommandBuilder()
        .withUpdateRolesBulkRoleCommand(
          new UpdateRolesBulkRoleCommandBuilder()
            .withRoleUuid(defaultRole.uuid)
            .withName('admin')
            .withPermissions([
              new PermissionObjectBuilder()
                .withId('all_permissions')
                .build(),
              new PermissionObjectBuilder()
                .withId('role')
                .withActions(['create', 'read', 'update', 'delete'])
                .build()
            ])
            .build()
        )
        .withUpdateRolesBulkRoleCommand(
          new UpdateRolesBulkRoleCommandBuilder()
            .withRoleUuid(role.uuid)
            .withName('should-update-role-is-updated')
            .withPermissions([
              new PermissionObjectBuilder()
                .withId('role')
                .withActions(['create', 'read', 'update', 'delete'])
                .build()
            ])
            .build()
        )
        .build()

      const response = await request(setup.httpServer)
        .post(`/roles/bulk`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(201)

      const rolesAfter = await new TypeOrmRepository(Role, dataSource.manager).find({
        where: { }
      })

      const updatedDefaultRole = rolesAfter.find(r => r.uuid === defaultRole.uuid)
      const updatedRole = rolesAfter.find(r => r.uuid === role.uuid)

      expect(updatedDefaultRole?.name).toEqual('admin')
      expect(updatedDefaultRole?.permissions).toEqual(['all_permissions', 'role.create', 'role.read', 'role.update', 'role.delete'])

      expect(updatedRole?.name).toEqual('should-update-role-is-updated')
      expect(updatedRole?.permissions).toEqual(['role.create', 'role.read', 'role.update', 'role.delete'])
    })
  })
})
