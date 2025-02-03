import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
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
        }),
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
        })
      ]
    }
  }
}
