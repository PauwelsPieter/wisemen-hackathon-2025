import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { sslHelper } from '../../config/sql/utils/typeorm.js'
import {
  SnakeNamingStrategy
} from '../../config/sql/naming-strategies/snake-case.naming-strategy.js'

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
        migrations: ['dist/src/config/sql/migrations/**/*.js'],
        migrationsRun: true,
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ConfigService]
    })
  }
}
