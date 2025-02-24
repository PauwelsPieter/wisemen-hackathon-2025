import '../modules/exceptions/sentry.js'
import { startOpentelemetry } from '../utils/opentelemetry/otel-sdk.js'
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, Module } from '@nestjs/common'
import { ProbedContainer } from '@wisemen/app-container/dist/containers/default.js'
import { AppModule } from '../app.module.js'
import { MetricsRegistrationModule } from '../utils/opentelemetry/metrics/metrics-registration.module.js'

@Module({
  imports: [
    AppModule.forRoot(),
    MetricsRegistrationModule
  ]
})
class MetricsModule {}

startOpentelemetry()

class Metrics extends ProbedContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(MetricsModule)
  }
}

const _metrics = new Metrics()
