import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource } from 'typeorm'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { setupTest } from '../../../../../test/setup/test-setup.js'
import { TestContext } from '../../../../../test/utils/test-context.js'
import type { TestUser } from '../../../users/tests/setup-user.type.js'
import { RoleSeeder } from '../../tests/seeders/role.seeder.js'
import { UpdateRolesBulkCommandBuilder, UpdateRolesBulkRoleCommandBuilder, PermissionObjectBuilder } from '../../tests/builders/commands/update-roles-bulk-command.builder.js'
import { RoleEntityBuilder } from '../../tests/builders/entities/role-entity.builder.js'

describe('Roles', () => {
  let app: NestExpressApplication
  let dataSource: DataSource

  let context: TestContext

  let adminRole: Role

  let adminUser: TestUser
  let readonlyUser: TestUser

  before(async () => {
    ({ app, dataSource, context } = await setupTest())

    adminRole = await context.getAdminRole()

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()
  })

  after(async () => {
    await app.close()
  })

  describe('Update role', () => {
    it('should return 401 when not authenticated', async () => {
      const roleDto = new UpdateRolesBulkCommandBuilder()
        .withUpdateRolesBulkRoleCommand(
          new UpdateRolesBulkRoleCommandBuilder()
            .withRoleUuid(adminRole.uuid)
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

      const response = await request(app.getHttpServer())
        .post(`/roles/bulk`)
        .send(roleDto)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const roleDto = new UpdateRolesBulkCommandBuilder()
        .withUpdateRolesBulkRoleCommand(
          new UpdateRolesBulkRoleCommandBuilder()
            .withRoleUuid(adminRole.uuid)
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

      const response = await request(app.getHttpServer())
        .post(`/roles/bulk`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
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
            .withRoleUuid(adminRole.uuid)
            .withName('admin')
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

      const response = await request(app.getHttpServer())
        .post(`/roles/bulk`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(201)

      const rolesAfter = await new TypeOrmRepository(Role, dataSource.manager).find({
        where: { }
      })

      const updatedAdminRole = rolesAfter.find(r => r.uuid === adminRole.uuid)
      const updatedRole = rolesAfter.find(r => r.uuid === role.uuid)

      expect(updatedAdminRole?.name).toEqual('admin')
      expect(updatedAdminRole?.permissions).toEqual(['admin', 'role.create', 'role.read', 'role.update', 'role.delete'])

      expect(updatedRole?.name).toEqual('should-update-role-is-updated')
      expect(updatedRole?.permissions).toEqual(['role.create', 'role.read', 'role.update', 'role.delete'])
    })
  })
})
