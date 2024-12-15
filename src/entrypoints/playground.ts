import '../modules/exceptions/sentry.js'

import { INestApplicationContext, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { SentryModule } from '@sentry/nestjs/setup'
import { ExceptionModule } from '../modules/exceptions/exception.module.js'
import { DefaultConfigModule } from '../modules/config/default-config.module.js'
import { DefaultTypeOrmModule } from '../modules/typeorm/default-typeorm.module.js'

@Module({
  imports: [
    SentryModule.forRoot(),
    DefaultConfigModule.forRoot(),
    DefaultTypeOrmModule.forRootAsync({ migrationsRun: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          privateKey: {
            key: Buffer.from(configService.getOrThrow<string>('RSA_PRIVATE'), 'base64'),
            passphrase: configService.getOrThrow('RSA_PASSPHRASE')
          },
          publicKey: Buffer.from(configService.getOrThrow<string>('RSA_PUBLIC'), 'base64'),
          global: true,
          signOptions: {
            algorithm: 'RS256'
          }
        }
      },
      global: true
    }),
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
