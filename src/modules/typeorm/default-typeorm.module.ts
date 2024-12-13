import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SnakeNamingStrategy, TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { sslHelper } from '../../config/sql/utils/typeorm.js'

@Module({})
export class DefaultTypeOrmModule {
  static forRootAsync (
    options: {
      migrationsRun?: boolean
      migrations?: string[]
    }
  ): DynamicModule {
    return TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DATABASE_URI'),
        ssl: sslHelper(configService.getOrThrow('DATABASE_SSL')),
        extra: { max: 50 },
        logging: false,
        synchronize: false,
        migrations: options.migrations,
        migrationsRun: options.migrationsRun ?? false,
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ConfigService]
    })
  }
}
