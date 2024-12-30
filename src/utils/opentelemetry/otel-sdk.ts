import { NodeSDK } from '@opentelemetry/sdk-node'
import { Resource } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { getOTLPExporterHeaders } from './signoz-auth.js'
import { IgnoredSpansProcessor } from './ignore-spans.processor.js'

export function startOpentelemetry (serviceName: string): void {
  if (process.env.NODE_ENV === 'test') return

  const sdk = configure(serviceName)

  sdk?.start()
}

function configure (serviceName: string): NodeSDK | null {
  const traceUrl = process.env.SIGNOZ_TRACE_ENDPOINT
  const metricsUrl = process.env.SIGNOZ_METRICS_ENDPOINT
  const env = process.env.NODE_ENV

  if (traceUrl == null || traceUrl === '' || metricsUrl == null || metricsUrl == '') {
    return null
  }

  const headers = getOTLPExporterHeaders()

  const traceExporter = new OTLPTraceExporter({
    url: traceUrl,
    headers
  })

  const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: metricsUrl,
      headers
    }),
    exportIntervalMillis: 10000,
    exportTimeoutMillis: 10000
  })

  const sdk = new NodeSDK({
    traceExporter,
    metricReader,
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

  return sdk
}
