import { DataSource } from 'typeorm'
import { sslHelper } from '../utils/typeorm.js'
import { SnakeNamingStrategy } from '../naming-strategies/snake-case.naming-strategy.js'

export const mainDataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: sslHelper(process.env.DATABASE_SSL),
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/config/sql/migrations/**/*.js'],
  namingStrategy: new SnakeNamingStrategy()
})
