import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsString } from 'class-validator'
import { ViewJobsIndexJob } from '../view-jobs-index.job.type.js'

export class ViewJobsIndexQueryKey {
  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsDateString({ strict: true })
  createdAt: string

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  id: string

  static nextKey (jobs: ViewJobsIndexJob[]): ViewJobsIndexQueryKey | null {
    if (jobs.length == 0) {
      return null
    }

    const lastItem = jobs.at(-1) as ViewJobsIndexJob

    return this.from(lastItem)
  }

  static from (job: ViewJobsIndexJob): ViewJobsIndexQueryKey {
    const key = new ViewJobsIndexQueryKey()

    key.createdAt = job.createdAt
    key.id = job.id

    return key
  }
}
