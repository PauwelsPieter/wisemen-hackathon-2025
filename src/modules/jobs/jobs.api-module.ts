import { Module } from '@nestjs/common'
import { ViewJobsIndexModule } from './use-cases/view-jobs-index.use-case.ts/view-jobs-index.module.js'
import { ViewJobDetailModule } from './use-cases/view-job-detail/view-job-detail.module.js'

@Module({
  imports: [
    ViewJobsIndexModule,
    ViewJobDetailModule
  ]
})
export class JobsApiModule {}
