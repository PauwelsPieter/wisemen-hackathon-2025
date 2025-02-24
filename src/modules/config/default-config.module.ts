import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envValidationSchema } from './env.validation.js'

@Module({})
export class DefaultConfigModule {
  static forRoot (): DynamicModule {
    return {
      module: DefaultConfigModule,
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          validationSchema: envValidationSchema,
          isGlobal: true
        })
      ]
    }
  }
}
