import { Module } from '@nestjs/common'
import { ViewJobsIndexModule } from './use-cases/view-jobs-index.use-case.ts/view-jobs-index.module.js'

@Module({
  imports: [
    ViewJobsIndexModule
  ]
})
export class JobsApiModule {}
