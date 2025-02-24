import '../modules/exceptions/sentry.js'

import { INestApplicationContext, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import { SentryModule } from '@sentry/nestjs/setup'
import { ExceptionModule } from '../modules/exceptions/exception.module.js'
import { DefaultConfigModule } from '../modules/config/default-config.module.js'
import { DefaultTypeOrmModule } from '../modules/typeorm/default-typeorm.module.js'

@Module({
  imports: [
    SentryModule.forRoot(),
    DefaultConfigModule.forRoot(),
    DefaultTypeOrmModule.forRootAsync({ migrationsRun: false }),
    ExceptionModule
  ]
})
class PlayGroundModule {

}

export class Playground extends JobContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(PlayGroundModule)
  }

  async execute (_app: INestApplicationContext): Promise<void> {

  }
}

const _playground = new Playground()
