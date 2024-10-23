import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from '../../config/env/configuration.js'
import { envValidationSchema } from '../../config/env/env.validation.js'

@Module({})
export class DefaultConfigModule {
  static forRoot (): DynamicModule {
    return ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE,
      load: [configuration],
      validationSchema: envValidationSchema,
      isGlobal: true
    })
  }
}
