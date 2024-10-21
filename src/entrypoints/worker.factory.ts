import { DynamicModule } from '@nestjs/common'
import { QueueName } from '../modules/pgboss/queue-name.enum.js'
import { AppModule } from '../app.module.js'
import { NatsWorkerModule } from '../modules/nats/outbox/nats-worker.module.js'

export class WorkerFactory {
  static create (queue: QueueName, pgBossModule: DynamicModule): DynamicModule {
    switch (queue) {
      case QueueName.NATS: return NatsWorkerModule.forRoot([pgBossModule])
      default: return AppModule.forRoot([pgBossModule])
    }
  }
}
