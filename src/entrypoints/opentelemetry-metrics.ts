import '../modules/exceptions/sentry.js'
import { startOpentelemetry } from '../utils/opentelemetry/otel-sdk.js'
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext } from '@nestjs/common'
import { WorkerContainer } from '@wisemen/app-container'
import { OpentelemetryMetricsModule as OpenTelemetryMetricsModule } from '../utils/opentelemetry/metrics/opentelemetry-metrics.module.js'

startOpentelemetry()

class OpenTelemetryMetrics extends WorkerContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(OpenTelemetryMetricsModule)
  }
}

const _metrics = new OpenTelemetryMetrics()
