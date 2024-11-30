import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { sslHelper } from '../../config/sql/utils/typeorm.js'
import { mainMigrations } from '../../config/sql/migrations/index.js'

@Module({})
export class DefaultTypeOrmModule {
  static forRootAsync (): DynamicModule {
    return TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DATABASE_URI'),
        ssl: sslHelper(configService.getOrThrow('DATABASE_SSL')),
        extra: { max: 50 },
        logging: false,
        synchronize: false,
        migrations: mainMigrations,
        migrationsRun: true,
        autoLoadEntities: true
      }),
      inject: [ConfigService]
    })
  }
}
