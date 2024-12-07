import { SetMetadata } from '@nestjs/common'
import { QueueName } from '../queue-name.enum.js'

export const PGBOSS_JOB_HANDLER = 'PGBOSS_JOB_HANDLER'
export const PGBOSS_QUEUE_NAME = 'PGBOSS_QUEUE_NAME'

export function PgBossJob (name: QueueName): ClassDecorator {
  return (target) => {
    SetMetadata(PGBOSS_QUEUE_NAME, name)(target)
    SetMetadata(PGBOSS_JOB_HANDLER, target.name)(target)
  }
}
