import { Module } from '@nestjs/common'
import { DefaultConfigModule } from '../../../modules/config/default-config.module.js'
import { DefaultTypeOrmModule } from '../../../modules/typeorm/default-typeorm.module.js'
import { MetricsRegistrationModule } from './registration/metrics-registration.module.js'

@Module({
  imports: [
    DefaultConfigModule,
    DefaultTypeOrmModule.forRootAsync({
      migrationsRun: false
    }),
    MetricsRegistrationModule
  ]
})
export class MetricsModule {}
