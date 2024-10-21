import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { sslHelper } from '../../config/sql/utils/typeorm.js'
import { mainMigrations } from '../../config/sql/migrations/index.js'

@Module({})
export class DefaultTypeormModule {
  static forRoot (): DynamicModule {
    return TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URI,
      ssl: sslHelper(process.env.DATABASE_SSL),
      extra: { max: 50 },
      logging: false,
      synchronize: false,
      migrations: mainMigrations,
      migrationsRun: true,
      autoLoadEntities: true
    })
  }
}
