import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Test } from '@nestjs/testing'
import { PgBossWorkerModule } from '@wisemen/pgboss-nestjs-job'
import { WorkerFactory } from '../worker.factory.js'
import { QueueName } from '../../modules/pgboss/enums/queue-name.enum.js'

describe('Workers test', () => {
  async function testWorkerStartup (queueName: QueueName): Promise<void> {
    const workerModule = WorkerFactory.create(queueName, PgBossWorkerModule.forRoot({ queueName }))
    const worker = await Test.createTestingModule({ imports: [workerModule] }).compile()

    return worker.close()
  }

  for (const queueName of Object.values(QueueName)) {
    it(`a ${queueName} worker starts successfully`, async () => {
      await expect(testWorkerStartup(queueName)).resolves.not.toThrow()
    })
  }
})
