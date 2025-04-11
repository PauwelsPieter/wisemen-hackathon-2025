import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OpenTelemetryLoggerService } from './logger.service.js'

@Module({
  imports: [ConfigModule],
  providers: [OpenTelemetryLoggerService],
  exports: [OpenTelemetryLoggerService]
})
export class LoggerModule {}
