import { ApiProperty } from '@nestjs/swagger'
import { PaginatedKeysetResponseMeta, PaginatedKeysetResponse } from '@wisemen/pagination'
import { QueuenameApiProperty } from '../../../pgboss/enums/queue-name.enum.js'
import { JobStatus, JobStatusApiProperty } from '../../job-status.enum.js'
import { ViewJobsIndexJob } from './view-jobs-index.job.type.js'
import { ViewJobsIndexQueryKey } from './query/view-jobs-index.query-key.js'

class ViewJobsIndexItemResponse {
  @QueuenameApiProperty()
  queueName: string

  @ApiProperty({ type: 'string' })
  id: string

  @ApiProperty({ type: 'string' })
  jobName: string

  @JobStatusApiProperty()
  status: JobStatus

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: string

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  completedAt: string | null

  constructor (job: ViewJobsIndexJob) {
    this.queueName = job.queueName
    this.id = job.id
    this.jobName = job.jobName
    this.status = job.status
    this.createdAt = job.createdAt
    this.completedAt = job.completedAt
  }
}

class ViewJobsIndexResponseMeta implements PaginatedKeysetResponseMeta {
  @ApiProperty({ type: ViewJobsIndexQueryKey, nullable: true })
  next: ViewJobsIndexQueryKey | null

  constructor (jobs: ViewJobsIndexJob[]) {
    this.next = ViewJobsIndexQueryKey.nextKey(jobs)
  }
}

export class ViewJobsIndexResponse implements PaginatedKeysetResponse {
  @ApiProperty({ type: ViewJobsIndexItemResponse, isArray: true })
  items: ViewJobsIndexItemResponse[]

  @ApiProperty({ type: ViewJobsIndexResponseMeta })
  meta: ViewJobsIndexResponseMeta

  constructor (jobs: ViewJobsIndexJob[]) {
    this.items = jobs.map(job => new ViewJobsIndexItemResponse(job))
    this.meta = new ViewJobsIndexResponseMeta(jobs)
  }
}
