import { Module } from '@nestjs/common'
import { ViewJobDetailController } from './view-job-detail.controller.js'
import { ViewJobDetailUseCase } from './view-job-detail.use-case.js'

@Module({
  controllers: [ViewJobDetailController],
  providers: [ViewJobDetailUseCase]
})
export class ViewJobDetailModule {}
