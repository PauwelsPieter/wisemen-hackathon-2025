import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envValidationSchema } from '../../config/env/env.validation.js'

@Module({})
export class DefaultConfigModule {
  static forRoot (): DynamicModule {
    return ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE,
      validationSchema: envValidationSchema,
      isGlobal: true
    })
  }
}
