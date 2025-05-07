import { Injectable } from '@nestjs/common'
import { CronjobUseCase } from '../cronjob.use-case.js'

@Injectable()
export class ExampleCronjobUseCase implements CronjobUseCase {
  execute (): Promise<void> {
    return Promise.resolve()
  }
}
