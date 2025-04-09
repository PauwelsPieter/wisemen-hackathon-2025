import { Module } from '@nestjs/common'
import { ViewJobsIndexController } from './view-jobs-index.controller.js'
import { ViewJobsIndexUseCase } from './view-jobs-index.use-case.js'

@Module({
  controllers: [ViewJobsIndexController],
  providers: [ViewJobsIndexUseCase]
})
export class ViewJobsIndexModule {}
