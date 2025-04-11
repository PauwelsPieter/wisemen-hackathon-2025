import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { getOTLPExporterHeaders } from './signoz-auth.js'
import { getOtelServiceName } from './get-otel-service-name.js'

export function startOpentelemetryMetrics (serviceName: string = getOtelServiceName()): void {
  if (process.env.NODE_ENV === 'test') return
  if (process.env.NODE_ENV === 'local') return

  const sdk = configureOpentelemetryMetrics(serviceName)

  sdk?.start()
}

export function configureOpentelemetryMetrics (serviceName: string): NodeSDK | null {
  const metricsUrl = process.env.SIGNOZ_METRICS_ENDPOINT
  const env = process.env.NODE_ENV

  if (metricsUrl == null || metricsUrl == '') {
    return null
  }

  const headers = getOTLPExporterHeaders()

  const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: metricsUrl,
      headers
    }),
    exportIntervalMillis: 10000,
    exportTimeoutMillis: 10000
  })

  return new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': serviceName,
      'deployment.environment': env
    }),
    metricReader
  })
}
