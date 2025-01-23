import { before, describe, it, after } from 'node:test'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { expect } from 'expect'
import { Any, type DataSource } from 'typeorm'
import type { Role } from '../../entities/role.entity.js'
import { UserRepository } from '../../../users/repositories/user.repository.js'
import { UserSeeder } from '../../../users/tests/user.seeder.js'
import { UserEntityBuilder } from '../../../users/tests/user-entity.builder.js'
import { TestAuthContext } from '../../../../../test/utils/test-auth-context.js'
import type { TestUser } from '../../../users/tests/setup-user.type.js'
import { UserRole } from '../../entities/user-role.entity.js'
import { RoleSeeder } from '../../tests/seeders/role.seeder.js'
import { UserRoleSeeder } from '../../tests/seeders/user-role.seeder.js'
import { RoleEntityBuilder } from '../../tests/builders/entities/role-entity.builder.js'
import { UserRoleEntityBuilder } from '../../tests/builders/entities/user-role-entity.builder.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'

describe('Delete role end to end tests', () => {
  let setup: EndToEndTestSetup
  let dataSource: DataSource
  let context: TestAuthContext
  let adminRole: Role
  let readonlyRole: Role
  let adminUser: TestUser
  let readonlyUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    context = setup.authContext
    dataSource = setup.dataSource
    adminRole = await context.getAdminRole()
    readonlyRole = await context.getReadonlyRole()

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()
  })

  after(async () => await setup.teardown())

  describe('Delete role', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(setup.httpServer)
        .delete(`/roles/${readonlyRole.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(setup.httpServer)
        .delete(`/roles/${readonlyRole.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 400 when deleting admin role', async () => {
      const response = await request(setup.httpServer)
        .delete(`/roles/${adminRole.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.body.errors[0].code).toBe('role_not_editable')
      expect(response.body.errors[0].detail).toBe('This role is not editable')

      expect(response).toHaveStatus(400)
    })

    it('should delete role', async () => {
      const role = await new RoleSeeder(dataSource.manager).seedOne(
        new RoleEntityBuilder()
          .withName('should-delete-role-with-staff')
          .build()
      )

      const userSeeder = new UserSeeder(dataSource.manager)
      const users = await userSeeder.seedMany([
        new UserEntityBuilder()
          .withEmail(randomUUID() + '@mail.com')
          .build(),
        new UserEntityBuilder()
          .withEmail(randomUUID() + '@mail.com')
          .build(),
        new UserEntityBuilder()
          .withEmail(randomUUID() + '@mail.com')
          .build()
      ])

      const userRoles: UserRole[] = users.map((user) => {
        return new UserRoleEntityBuilder()
          .withUserUuid(user.uuid)
          .withRoleUuid(role.uuid)
          .build()
      })

      await new UserRoleSeeder(dataSource.manager).seedUserRoles(userRoles)

      const response = await request(setup.httpServer)
        .delete(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)

      // check if users do not have the role anymore
      const usersAfter = await new UserRepository(dataSource.manager).find({
        where: { uuid: Any(users.map(user => user.uuid)) },
        relations: { userRoles: { role: true } }
      })

      usersAfter.forEach((user) => {
        expect(user.userRoles).toHaveLength(0)
      })
    })
  })
})
