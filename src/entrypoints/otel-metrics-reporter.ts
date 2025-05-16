import '../modules/exceptions/sentry.js'
import { startOpentelemetryMetrics } from '../utils/opentelemetry/otel-metrics-sdk.js'
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext } from '@nestjs/common'
import { WorkerContainer } from '@wisemen/app-container'
import { OpentelemetryMetricsModule as OpenTelemetryMetricsModule } from '../utils/opentelemetry/metrics/opentelemetry-metrics.module.js'

startOpentelemetryMetrics()

class OpenTelemetryMetrics extends WorkerContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(OpenTelemetryMetricsModule)
  }
}

const _metrics = new OpenTelemetryMetrics()
