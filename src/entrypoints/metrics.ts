import '../modules/exceptions/sentry.js'
import { startOpentelemetry } from '../utils/opentelemetry/otel-sdk.js'
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext } from '@nestjs/common'
import { ProbedContainer } from '@wisemen/app-container/dist/containers/default.js'
import { MetricsModule } from '../utils/opentelemetry/metrics/metrics.module.js'

startOpentelemetry()

class Metrics extends ProbedContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(MetricsModule)
  }
}

const _metrics = new Metrics()
