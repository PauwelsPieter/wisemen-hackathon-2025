import { QueueName } from '../queue-name.enum.js'

export interface PgBossWorkerConfig {
  queueName: QueueName
  concurrency?: number
  pollInterval?: number
  batchSize?: number
  fetchRefreshThreshold?: number
  isOnCompleteWorker?: boolean
}
