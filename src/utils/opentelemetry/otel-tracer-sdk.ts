import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { getOtelServiceName } from '@wisemen/opentelemetry'
import { getOTLPExporterHeaders } from './signoz-auth.js'
import { IgnoredSpansProcessor } from './ignore-spans.processor.js'
import { registerInstruments } from './instrumentations.js'

registerInstruments()

export function startOpentelemetryTracing (serviceName: string = getOtelServiceName()): void {
  if (process.env.NODE_ENV === 'test') return
  if (process.env.NODE_ENV === 'local') return

  const sdk = configureOpentelemetryTracing(serviceName)

  sdk?.start()
}

function configureOpentelemetryTracing (serviceName: string): NodeSDK | null {
  const traceUrl = process.env.SIGNOZ_TRACE_ENDPOINT
  const env = process.env.NODE_ENV

  if (traceUrl == null || traceUrl === '') {
    return null
  }

  const headers = getOTLPExporterHeaders()

  const traceExporter = new OTLPTraceExporter({
    url: traceUrl,
    headers
  })

  const sdk = new NodeSDK({
    traceExporter,
    spanProcessors: [
      new IgnoredSpansProcessor(traceExporter, {
        maxQueueSize: 2048,
        scheduledDelayMillis: 5000,
        exportTimeoutMillis: 30000,
        maxExportBatchSize: 512
      })
    ],
    resource: resourceFromAttributes({
      'service.name': serviceName,
      'deployment.environment': env
    })
  })

  return sdk
}
