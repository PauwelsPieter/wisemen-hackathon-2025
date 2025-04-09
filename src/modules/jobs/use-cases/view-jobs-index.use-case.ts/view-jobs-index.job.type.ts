import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'
import { JobStatus } from '../../job-status.enum.js'

export interface ViewJobsIndexJob {
  queueName: QueueName
  id: string
  jobName: string
  status: JobStatus
  createdAt: string
  completedAt: string | null
}
