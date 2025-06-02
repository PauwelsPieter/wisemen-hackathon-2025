import { ClassConstructor } from 'class-transformer'
import { exhaustiveCheck } from '../utils/helpers/exhaustive-check.helper.js'
import { CronjobType } from '../modules/cronjobs/cronjob-type.enum.js'
import { ExampleCronjobModule } from '../modules/cronjobs/example/example.cron-job.module.js'

export class CronjobFactory {
  static create (cronjob: CronjobType): ClassConstructor<unknown> {
    switch (cronjob) {
      case CronjobType.EXAMPLE: return ExampleCronjobModule
      default: return exhaustiveCheck(cronjob)
    }
  }
}
