import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { createStubInstance } from 'sinon'
import { TypesenseInitializationService } from '../services/typesense-initialization.service.js'
import { ImportTypesenseJobHandler } from '../jobs/import-typesense/import-typesense.handler.js'
import { TestBench } from '../../../../test/setup/test-bench.js'

describe('Test import typesense job', () => {
  before(() => TestBench.setupUnitTest())

  describe('Test import typesense job handler', () => {
    it('should migrate and import typesense', async () => {
      const initializationService = createStubInstance(TypesenseInitializationService)
      const handler = new ImportTypesenseJobHandler(initializationService)

      await handler.run()

      expect(initializationService.import.calledOnce).toBe(true)
      expect(initializationService.migrate.calledOnce).toBe(true)
    })
  })
})
