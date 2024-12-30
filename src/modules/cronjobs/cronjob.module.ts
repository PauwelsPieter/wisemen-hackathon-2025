import { DynamicModule, Module } from '@nestjs/common'
import { CronjobConfig } from './cronjob.config.js'
import { CronjobTypeMapping } from './cronjob-type.mapping.js'
import { ConfigurableModuleClass } from './config.module-definition.js'

@Module({})
export class CronjobModule extends ConfigurableModuleClass {
  static async forRootAsync (config: CronjobConfig): Promise<DynamicModule> {
    const mappingResolver = CronjobTypeMapping[config.type]
    const mapping = await mappingResolver()

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
