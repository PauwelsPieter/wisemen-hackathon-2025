import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { sslHelper } from '../../config/sql/utils/typeorm.js'
// import { mainMigrations } from '../../config/sql/migrations/index.js'

@Module({})
export class DefaultTypeormModule {
  static forRoot (): DynamicModule {
    return TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DATABASE_URI'),
        ssl: sslHelper(configService.getOrThrow('DATABASE_SSL')),
        extra: { max: 50 },
        logging: false,
        synchronize: false,
        // migrations: mainMigrations,
        migrations: ['dist/src/config/sql/migrations/**/*.js'],
        migrationsRun: true,
        autoLoadEntities: true
      }),
      inject: [ConfigService]
    })
  }
}
