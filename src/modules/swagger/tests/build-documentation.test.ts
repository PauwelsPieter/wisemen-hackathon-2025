import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { SwaggerModule } from '@nestjs/swagger'
import { TestBench } from '../../../../test/setup/test-bench.js'
import { EndToEndTestSetup } from '../../../../test/setup/end-to-end-test-setup.js'
import { buildApiDocumentation } from '../helpers/build-api-documentation.js'
import { buildWebSocketDocumentation } from '../helpers/build-websocket-documentation.js'

describe('Build documentation tests', () => {
  let setup: EndToEndTestSetup

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
  })

  after(async () => await setup.teardown())

  it('it builds the api documentation', () => {
    expect(() => {
      const documentation = buildApiDocumentation()

      SwaggerModule.createDocument(setup.app, documentation)
    }).not.toThrow()
  })

  it('it builds the websocket documentation', () => {
    expect(() => {
      const documentation = buildWebSocketDocumentation()

      SwaggerModule.createDocument(setup.app, documentation)
    }).not.toThrow()
  })
})
