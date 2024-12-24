import { NodeSDK } from '@opentelemetry/sdk-node'
import { Resource } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express'
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk'
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis-4'
import * as Sentry from '@sentry/nestjs'
import { getOTLPExporterHeaders } from './signoz-auth.js'
import { IgnoredSpansProcessor } from './ignore-spans.processor.js'

register()

export function startTracers (serviceName: string): void {
  if (process.env.NODE_ENV === 'test') return

  const tracer = createTracer(serviceName)

  tracer?.start()
}

function createTracer (serviceName: string): NodeSDK | null {
  const url = process.env.SIGNOZ_TRACE_ENDPOINT
  const env = process.env.NODE_ENV

  if (url == null) {
    return null
  }

  const headers = getOTLPExporterHeaders()

  const traceExporter = new OTLPTraceExporter({ url, headers })

  const tracer = new NodeSDK({
    traceExporter,
    spanProcessors: [
      new IgnoredSpansProcessor(traceExporter, {
        maxQueueSize: 2048,
        scheduledDelayMillis: 5000,
        exportTimeoutMillis: 30000,
        maxExportBatchSize: 512
      })
    ],
    resource: new Resource({
      'service.name': `${serviceName}`,
      'deployment.environment': `${env}`
    })
  })

  return tracer
}

function register () {
  if (process.env.NODE_ENV === 'test') return

  registerInstrumentations({
    instrumentations: [
      new PgInstrumentation({
        enhancedDatabaseReporting: true
      }),
      new HttpInstrumentation({}),
      new ExpressInstrumentation({
        ignoreLayersType: [ExpressLayerType.MIDDLEWARE, ExpressLayerType.REQUEST_HANDLER]
      }),
      new NestInstrumentation({}),
      new AwsInstrumentation({
        suppressInternalInstrumentation: true
      }),
      new RedisInstrumentation({
        dbStatementSerializer: (cmdName, cmdArgs) => {
          const maxArgsLength = 100
          const args = cmdArgs.map((arg) => {
            const argStr = arg.toString()

            return argStr.length > maxArgsLength ? `${argStr.substring(0, maxArgsLength)}...` : argStr
          })

          return `${cmdName} ${args.join(' ')}`
        }
      })
    ]
  })
}
