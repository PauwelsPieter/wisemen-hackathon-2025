import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { EndToEndTestSetup } from '../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../test/setup/test-bench.js'

describe('Swagger e2e tests', () => {
  let setup: EndToEndTestSetup

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
  })

  after(async () => await setup.teardown())

  it('returns 200 with html file', async () => {
    const response = await request(setup.httpServer)
      .get('/oauth2-redirect')

    expect(response.status).toBe(200)
    expect(response.get('Content-Type')).toBe('text/html; charset=UTF-8')
  })
})
