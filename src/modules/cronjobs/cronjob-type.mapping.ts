import { CronjobType } from './cronjob-type.enum.js'

export const CronjobTypeMapping = {
  [CronjobType.EXAMPLE]: async () => {
    return {
      module: (await import('./example/example.cron-job.module.js')).ExampleCronjobModule,
      useCase: (await import('./example/example.cron-job.use-case.js')).ExampleCronjobUseCase
    }
  }
}
