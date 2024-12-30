import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Job } from '../../../modules/pgboss/persistence/job.entity.js'
import { MetricsService } from './metrics.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([Job])], // Register the Job repository
  providers: [MetricsService], // Add the metrics service
  exports: [MetricsService] // Optional: Export if needed elsewhere
})
export class MetricsModule {}
