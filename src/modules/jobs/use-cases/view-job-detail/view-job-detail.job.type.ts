import { Serializable } from '../../../../utils/types/serializable.js'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'
import { JobStatus } from '../../job-status.enum.js'

export interface ViewJobDetailJob {
  id: string
  queueName: QueueName
  priority: number
  name: string
  data: Serializable
  status: JobStatus
  retryLimit: number
  retryCount: number
  retryDelay: number
  retryBackoff: boolean
  startAfter: string
  startedAt: string | null
  singletonKey: string | null
  singletonOn: string | null
  expireIn: Serializable
  createdAt: string
  completedAt: string | null
  keepUntil: string
  output: Serializable | null
  deadLetter: string | null
  policy: string | null
}
