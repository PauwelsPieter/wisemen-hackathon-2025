import '../modules/exceptions/sentry.js'
import { startOpentelemetry } from '../utils/opentelemetry/otel-sdk.js'
import { NestFactory } from '@nestjs/core'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { INestApplicationContext } from '@nestjs/common'
import { WorkerContainer } from '@wisemen/app-container'
import { PgBossWorkerModule } from '@wisemen/pgboss-nestjs-job'
import { QueueName } from '../modules/pgboss/enums/queue-name.enum.js'
import { WorkerFactory } from './worker.factory.js'

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
const queueName = unvalidatedQueueName

startOpentelemetry()

class Worker extends WorkerContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(
      WorkerFactory.create(
        queueName,
        PgBossWorkerModule.forRoot({
          queueName,
          concurrency: args.concurrency,
          batchSize: args.concurrency * 4,
          fetchRefreshThreshold: args.concurrency * 4,
          pollInterval: args.interval
        })
      )
    )
  }
}

const _worker = new Worker()
