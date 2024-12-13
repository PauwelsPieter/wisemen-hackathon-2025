import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupTest } from '../../../../../test/setup/test-setup.js'
import { TestContext } from '../../../../../test/utils/test-context.js'
import type { TestUser } from '../../../users/tests/setup-user.type.js'
import { CreateRoleCommandBuilder } from '../../tests/builders/commands/create-role-command.builder.js'
import { RoleModule } from '../../role.module.js'

describe('Roles', () => {
  let app: NestExpressApplication

  let context: TestContext

  let adminUser: TestUser
  let readonlyUser: TestUser

  before(async () => {
    ({ app, context } = await setupTest([RoleModule]))

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()
  })

  after(async () => {
    await app.close()
  })

  describe('Create role', () => {
    it('should return 401 when not authenticated', async () => {
      const roleDto = new CreateRoleCommandBuilder()
        .withName('should-return-401-when-not-authenticated')
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(roleDto)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const roleDto = new CreateRoleCommandBuilder()
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(403)
    })

    it('should create role', async () => {
      const roleDto = new CreateRoleCommandBuilder()
        .withName('should-create-role-test')
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(201)
    })

    it('should create role not a second time', async () => {
      const roleDto = new CreateRoleCommandBuilder().build()

      await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(409)
      expect(response).toHaveErrorCode('role_name_already_in_use')
    })

    it('should not create role with invalid name', async () => {
      const roleDto = new CreateRoleCommandBuilder()
        .withName('')
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(400)
    })
  })
})
