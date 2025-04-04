import { Module } from '@nestjs/common'
import { MetricsObserverService } from './metrics-observer.service.js'

@Module({
  providers: [MetricsObserverService],
  exports: [MetricsObserverService]
})
export class MetricsObserverModule {}
