import { DynamicModule } from '@nestjs/common'
import { QueueName } from '../modules/pgboss/enums/queue-name.enum.js'
import { SystemWorkerModule } from '../modules/system-worker/system-worker.module.js'
import { exhaustiveCheck } from '../utils/helpers/exhaustive-check.helper.js'

export class WorkerFactory {
  static create (queueName: QueueName, pgBossModule: DynamicModule): DynamicModule {
    switch (queueName) {
      case QueueName.SYSTEM: return SystemWorkerModule.forRoot([pgBossModule])
      default: return exhaustiveCheck(queueName)
    }
  }
}
