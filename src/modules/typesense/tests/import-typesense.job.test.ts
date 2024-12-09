import { after, before, describe, it, mock } from 'node:test'
import type { TestingModule } from '@nestjs/testing'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupTest } from '../../../../test/setup/test-setup.js'
import { TypesenseInitializationService } from '../services/typesense-initialization.service.js'
import { ImportTypesenseJobHandler } from '../jobs/import-typesense/import-typesense.handler.js'

describe('Test import typesense job', () => {
  let app: NestExpressApplication
  let testModule: TestingModule

  before(async () => {
    ({ app, testModule } = await setupTest())
  })

  after(async () => {
    await app.close()
  })

  describe('Test import typesense job handler', () => {
    it('should migrate and import typesense', async () => {
      const spyImport = mock.method(TypesenseInitializationService.prototype, 'migrate', async () => { })
      const spyMigrate = mock.method(TypesenseInitializationService.prototype, 'import', async () => { })

      const handler = testModule.get(ImportTypesenseJobHandler, { strict: false })

      await handler.run()

      expect(spyImport.mock.callCount()).toBe(1)
      expect(spyMigrate.mock.callCount()).toBe(1)

      spyImport.mock.restore()
      spyMigrate.mock.restore()
    })
  })
})
