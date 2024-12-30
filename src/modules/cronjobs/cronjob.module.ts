import { DynamicModule, Module } from '@nestjs/common'
import { CronjobConfig } from './cronjob.config.js'
import { CronjobTypeMapping } from './cronjob-type.mapping.js'

@Module({})
export class CronjobModule {
  static forRoot (config: CronjobConfig): DynamicModule {
    const mapping = CronjobTypeMapping[config.type]

    return {
      module: CronjobModule,
      imports: [
        mapping.module
      ],
      providers: [
        {
          provide: 'CronjobUseCase',
          useExisting: mapping.useCase
        }
      ]
    }
  }
}
