import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Job } from '../../../modules/pgboss/persistence/job.entity.js'
import { MetricsService } from './metrics.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  providers: [MetricsService],
  exports: [MetricsService]
})
export class MetricsModule {}
