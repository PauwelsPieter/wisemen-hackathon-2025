import '../modules/exceptions/sentry.js'

import { NestFactory } from '@nestjs/core'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { INestApplicationContext, Module } from '@nestjs/common'
import { WorkerContainer } from '@wisemen/app-container'
import { QueueName } from '../modules/pgboss/queue-name.enum.js'
import { AppModule } from '../app.module.js'
import { PgBossWorkerModule } from '../modules/pgboss/worker/pgboss-worker.module.js'

const args = await yargs(hideBin(process.argv))
  .option('queue', {
    alias: 'q',
    type: 'string',
    description: 'The name of the queue to handle',
    choices: Object.values(QueueName),
    demandOption: true
  })
  .option('concurrency', {
    alias: 'c',
    type: 'number',
    description: 'The number of jobs to process concurrently',
    default: 1
  })
  .option('interval', {
    alias: 'i',
    type: 'number',
    description: 'The interval in milliseconds to poll for new jobs',
    default: 2000
  })
  .help()
  .argv

const unvalidatedQueueName = args.queue

if (!Object.values(QueueName).includes(unvalidatedQueueName as QueueName)) {
  throw new Error(`Queue ${unvalidatedQueueName} not found`)
}
const queueName = unvalidatedQueueName as QueueName

@Module({
  imports: [
    AppModule.forRoot(),
    PgBossWorkerModule.forRoot({
      queueName,
      concurrency: args.concurrency,
      batchSize: args.concurrency * 4,
      fetchRefreshThreshold: args.concurrency * 4,
      pollInterval: args.interval
    })
  ]
})
class WorkerModule {}

class Worker extends WorkerContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(WorkerModule)
  }
}

const _worker = new Worker()
