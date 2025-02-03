import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource } from 'typeorm'
import type { File } from '../entities/file.entity.js'
import { TestAuthContext } from '../../../../test/utils/test-auth-context.js'
import type { TestUser } from '../../users/tests/setup-user.type.js'
import { EndToEndTestSetup } from '../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../test/setup/test-bench.js'
import { CreateFileDtoBuilder } from './builders/create-file-dto.builder.js'
import { FileSeeder } from './seeders/file.seeder.js'
import { FileBuilder } from './builders/file-link.builder.js'

describe('File', () => {
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

  describe('Create file', () => {
    it('should return 401 when creating a file without a token', async () => {
      const response = await request(setup.httpServer)
        .post('/file')

      expect(response).toHaveStatus(401)
    })

    it('should return 400 when creating a file with an invalid body', async () => {
      const response = await request(setup.httpServer)
        .post('/file')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({})

      expect(response).toHaveStatus(400)
    })

    it('should create file and return 201', async () => {
      const fileDto = new CreateFileDtoBuilder()
        .build()

      const response = await request(setup.httpServer)
        .post('/file')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(fileDto)

      expect(response).toHaveStatus(201)
    })
  })

  describe('Download file', () => {
    let file: File

    before(async () => {
      file = await new FileSeeder(dataSource.manager)
        .seedOne(new FileBuilder().build())
    })

    it('should return 401 when downloading a file without a token', async () => {
      const response = await request(setup.httpServer)
        .post(`/file/${file.uuid}/download`)

      expect(response).toHaveStatus(401)
    })

    it('should redirect to s3 download link', async () => {
      const response = await request(setup.httpServer)
        .post(`/file/${file.uuid}/download`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(302)
    })
  })

  describe('Delete a file', () => {
    let file: File

    before(async () => {
      file = await new FileSeeder(dataSource.manager)
        .seedOne(new FileBuilder().build())
    })

    it('should return 401 when deleting a file when no token is provided', async () => {
      const response = await request(setup.httpServer)
        .delete(`/file/${file.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should delete the file', async () => {
      const response = await request(setup.httpServer)
        .delete(`/file/${file.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })
  })
})
