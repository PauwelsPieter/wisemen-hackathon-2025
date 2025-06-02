import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { ExampleCronjobUseCase } from './example.cron-job.use-case.js'

@Module({
  providers: [ExampleCronjobUseCase],
  exports: [ExampleCronjobUseCase]
})
export class ExampleCronjobModule implements OnApplicationBootstrap {
  constructor (private useCase: ExampleCronjobUseCase) {}

  async onApplicationBootstrap (): Promise<void> {
    await this.useCase.execute()
  }
}
