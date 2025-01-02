import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupTest } from '../../../test/setup/test-setup.js'
import { SwaggerModule } from './swagger.module.js'

describe('Swagger e2e tests', () => {
  let app: NestExpressApplication

  before(async () => {
    ({ app } = await setupTest([SwaggerModule]))
  })

  after(async () => {
    await app.close()
  })

  it('returns 200 with html file', async () => {
    const response = await request(app.getHttpServer())
      .get('/oauth2-redirect')

    expect(response.status).toBe(200)
    expect(response.get('Content-Type')).toBe('text/html; charset=UTF-8')
  })
})
