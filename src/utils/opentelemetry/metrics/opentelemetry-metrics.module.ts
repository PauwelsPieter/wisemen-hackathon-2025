import { Module } from '@nestjs/common'
import { DefaultConfigModule } from '../../../modules/config/default-config.module.js'
import { DefaultTypeOrmModule } from '../../../modules/typeorm/default-typeorm.module.js'
import { MetricsObserverModule } from './registration/metrics-observer.module.js'

@Module({
  imports: [
    DefaultConfigModule,
    DefaultTypeOrmModule.forRootAsync({
      migrationsRun: false
    }),
    MetricsObserverModule
  ]
})
export class OpentelemetryMetricsModule {}
