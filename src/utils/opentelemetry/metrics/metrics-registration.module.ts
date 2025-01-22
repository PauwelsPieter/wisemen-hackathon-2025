import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Job } from '@wisemen/pgboss-nestjs-job'
import { MetricsRegistrationService } from './metrics-registration.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  providers: [MetricsRegistrationService],
  exports: [MetricsRegistrationService]
})
export class MetricsRegistrationModule {}
