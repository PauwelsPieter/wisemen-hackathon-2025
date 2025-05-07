import { Module } from '@nestjs/common'
import { ExampleCronjobUseCase } from './example.cron-job.use-case.js'

@Module({
  providers: [ExampleCronjobUseCase],
  exports: [ExampleCronjobUseCase]
})
export class ExampleCronjobModule {}
