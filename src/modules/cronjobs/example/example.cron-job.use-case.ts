import { Injectable } from '@nestjs/common'

@Injectable()
export class ExampleCronjobUseCase {
  execute (): Promise<void> {
    return Promise.resolve()
  }
}
