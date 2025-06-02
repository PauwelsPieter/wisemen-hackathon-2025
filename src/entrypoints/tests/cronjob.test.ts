import { describe, it } from 'node:test'
import { Test } from '@nestjs/testing'
import { expect } from 'expect'
import { CronjobType } from '../../modules/cronjobs/cronjob-type.enum.js'
import { AppModule } from '../../app.module.js'
import { CronjobFactory } from '../cronjob.factory.js'

describe('Cronjob tests', () => {
  async function testCronjobStartup (type: CronjobType): Promise<void> {
    const cronjobModule = AppModule.forRoot([
      CronjobFactory.create(type)
    ])

    const worker = await Test.createTestingModule({
      imports: [cronjobModule]
    }).compile()

    return worker.close()
  }

  for (const type of Object.values(CronjobType)) {
    it(`Cronjob ${type} starts successfully`, async () => {
      await expect(testCronjobStartup(type)).resolves.not.toThrow()
    })
  }
})
