import { Module } from '@nestjs/common'
import { MetricsRegistrationService } from './metrics-registration.service.js'

@Module({
  providers: [MetricsRegistrationService],
  exports: [MetricsRegistrationService]
})
export class MetricsRegistrationModule {}
