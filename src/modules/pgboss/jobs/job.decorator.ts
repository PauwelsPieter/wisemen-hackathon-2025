import { SetMetadata } from '@nestjs/common'
import { QueueName } from '../queue-name.enum.js'
import { BaseJobConfig, BaseJobData } from './job.abstract.js'

export const PGBOSS_JOB_HANDLER = 'PGBOSS_JOB_HANDLER'
export const PGBOSS_QUEUE_NAME = 'PGBOSS_QUEUE_NAME'

type ConfigConstructor<S extends BaseJobData, T extends BaseJobConfig<S>>
  = new (...args: unknown[]) => T

export function PgBossJobHandler<S extends BaseJobData, T extends BaseJobConfig<S>> (
  name: QueueName,
  config: ConfigConstructor<S, T>
): ClassDecorator {
  return (target) => {
    SetMetadata(PGBOSS_QUEUE_NAME, name)(target)
    SetMetadata(PGBOSS_JOB_HANDLER, config.name)(target)
    SetMetadata(PGBOSS_QUEUE_NAME, name)(config)
    SetMetadata(PGBOSS_JOB_HANDLER, config.name)(config)
  }
}
