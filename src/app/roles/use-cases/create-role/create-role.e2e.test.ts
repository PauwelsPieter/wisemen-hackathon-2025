import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { TestAuthContext } from '../../../../../test/utils/test-auth-context.js'
import type { TestUser } from '../../../users/tests/setup-user.type.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'
import { CreateRoleCommandBuilder } from './create-role.command.builder.js'

describe('Create role end to end tests', () => {
  let setup: EndToEndTestSetup
  let context: TestAuthContext
  let adminUser: TestUser
  let defaultUser: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    context = setup.authContext

    adminUser = await context.getAdminUser()
    defaultUser = await context.getDefaultUser()
  })

  after(async () => await setup.teardown())

  describe('Create role', () => {
    it('should return 401 when not authenticated', async () => {
      const roleDto = new CreateRoleCommandBuilder()
        .withName('should-return-401-when-not-authenticated')
        .build()

      const response = await request(setup.httpServer)
        .post('/roles')
        .send(roleDto)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const command = new CreateRoleCommandBuilder().build()

      const response = await request(setup.httpServer)
        .post('/roles')
        .set('Authorization', `Bearer ${defaultUser.token}`)
        .send(command)

      expect(response).toHaveStatus(403)
    })

    it('should create role', async () => {
      const command = new CreateRoleCommandBuilder()
        .withName('should-create-role-test')
        .build()

      const response = await request(setup.httpServer)
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(command)

      expect(response).toHaveStatus(201)
    })

    it('should create role not a second time', async () => {
      const command = new CreateRoleCommandBuilder().build()

      await request(setup.httpServer)
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(command)

      const response = await request(setup.httpServer)
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(command)

      expect(response).toHaveStatus(409)
      expect(response).toHaveErrorCode('role_name_already_in_use')
    })

    it('should not create role with invalid name', async () => {
      const command = new CreateRoleCommandBuilder()
        .withName('')
        .build()

      const response = await request(setup.httpServer)
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(command)

      expect(response).toHaveStatus(400)
    })
  })
})
