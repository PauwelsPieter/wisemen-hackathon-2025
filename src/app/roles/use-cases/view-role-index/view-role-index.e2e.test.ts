import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource } from 'typeorm'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { UserSeeder } from '../../../users/tests/user.seeder.js'
import { UserEntityBuilder } from '../../../users/tests/user-entity.builder.js'
import type { TestUser } from '../../../users/tests/setup-user.type.js'
import { RoleSeeder } from '../../tests/seeders/role.seeder.js'
import { UserRoleSeeder } from '../../tests/seeders/user-role.seeder.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'
import { RoleEntityBuilder } from '../../tests/builders/entities/role-entity.builder.js'
import { UserRoleEntityBuilder } from '../../tests/builders/entities/user-role-entity.builder.js'

describe('View roles end to end tests', () => {
  let setup: EndToEndTestSetup
  let dataSource: DataSource
  let adminUser: TestUser
  let defaultUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    dataSource = setup.dataSource

    adminUser = await setup.authContext.getAdminUser()
    defaultUser = await setup.authContext.getDefaultUser()
  })

  after(async () => await setup.teardown())

  describe('Get roles', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(setup.httpServer)
        .get('/roles')

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(setup.httpServer)
        .get('/roles')
        .set('Authorization', `Bearer ${defaultUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return roles when admin', async () => {
      const response = await request(setup.httpServer)
        .get('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return roles when having ROLE_READ permission', async () => {
      const role = await new RoleSeeder(dataSource.manager).seedOne(
        new RoleEntityBuilder()
          .withName('should-return-roles-when-having-role-read-permission')
          .withPermissions([Permission.ROLE_READ])
          .build()
      )
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .build()
      )

      await new UserRoleSeeder(dataSource.manager).seedOne(
        new UserRoleEntityBuilder()
          .withUserUuid(user.uuid)
          .withRoleUuid(role.uuid)
          .build()
      )

      const token = setup.authContext.getToken(user)

      const response = await request(setup.httpServer)
        .get('/roles')
        .set('Authorization', `Bearer ${token}`)

      expect(response).toHaveStatus(200)
    })
  })
})
