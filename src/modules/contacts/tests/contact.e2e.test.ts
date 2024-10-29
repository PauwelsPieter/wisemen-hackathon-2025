import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import request from 'supertest'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupTest } from '../../../utils/test-setup/setup.js'
import { TestUser } from '../../users/tests/setup-user.type.js'
import { TestContext } from '../../../../test/utils/test-context.js'
import { Contact } from '../entities/contact.entity.js'

describe('Contact E2E', () => {
  let app: NestExpressApplication
  let context: TestContext
  let adminUser: TestUser

  let contact: Contact

  before(async () => {
    ({ app, context } = await setupTest())

    adminUser = await context.getAdminUser()
  })

  after(async () => {
    await app.close()
  })

  describe('Create contact', () => {
    it('should fail to create a contact without auth', async () => {
      const createContactCommand = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '+15555555555'
      }

      const response = await request(app.getHttpServer())
        .post('/contacts')
        .send(createContactCommand)

      expect(response).toHaveStatus(401)
    })

    it('should create a contact successfully', async () => {
      const createContactCommand = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '+32473301974'
      }

      const response = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(createContactCommand)

      expect(response).toHaveStatus(201)

      expect(response.body).toHaveProperty('uuid')
      expect(response.body.firstName).toBe(createContactCommand.firstName)
      expect(response.body.lastName).toBe(createContactCommand.lastName)
      expect(response.body.email).toBe(createContactCommand.email)
      expect(response.body.phone).toBe(createContactCommand.phone)
      expect(response.body.isActive).toBe(true)
      expect(response.body).toHaveProperty('createdAt')
      expect(response.body).toHaveProperty('updatedAt')

      contact = response.body as Contact
    })
  })

  describe('Get Contacts', () => {
    it('should fail to get contacts without auth', async () => {
      const response = await request(app.getHttpServer())
        .get('/contacts')

      expect(response).toHaveStatus(401)
    })

    it('should get contacts successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/contacts')
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
      expect(response.body).not.toBeNull()
      expect(response.body.items.length).toBeGreaterThan(0)
    })
  })

  describe('Update contact', () => {
    it('should fail to update a contact without auth', async () => {
      const updateContactCommand = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: ''
      }

      const response = await request(app.getHttpServer())
        .put(`/contacts/${contact.uuid}`)
        .send(updateContactCommand)

      expect(response).toHaveStatus(401)
    })

    it('should update a contact successfully', async () => {
      const updateContactCommand = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: null,
        phone: '+32473301974',
        isActive: true
      }

      const response = await request(app.getHttpServer())
        .put(`/contacts/${contact.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(updateContactCommand)

      expect(response).toHaveStatus(200)
    })
  })

  describe('Get contact', () => {
    it('should fail to get a contact without auth', async () => {
      const response = await request(app.getHttpServer())
        .get(`/contacts/${contact.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should get a contact successfully', async () => {
      const response = await request(app.getHttpServer())
        .get(`/contacts/${contact.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
      expect(response.body).not.toBeNull()
      expect(response.body.uuid).toBe(contact.uuid)
      expect(response.body.email).toBeNull()
    })
  })
})
