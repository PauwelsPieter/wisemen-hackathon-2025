import {
  LoggerProvider,
  BatchLogRecordProcessor
} from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { SeverityNumber, type Logger } from '@opentelemetry/api-logs'
import { getOTLPExporterHeaders } from './signoz-auth.js'

export enum LogContext {
  INFO = 'info'
}

interface LogRecord {
  context: LogContext
  body: object
  attributes?: Record<string, unknown>
}

class OpenTelemetryLogger {
  private readonly loggerProvider: LoggerProvider
  private readonly logProvider: Logger | null
  private readonly hostname: string

  constructor () {
    if (process.env.SIGNOZ_LOG_ENDPOINT == null) {
      this.logProvider = null

      return
    }

    const headers = getOTLPExporterHeaders()

    const logExporter = new OTLPLogExporter({
      url: process.env.SIGNOZ_LOG_ENDPOINT,
      headers,
      concurrencyLimit: 1
    })

    this.loggerProvider = new LoggerProvider()
    this.loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter))

    this.logProvider = this.loggerProvider.getLogger('default')
  }

  public info (logRecord: LogRecord): void {
    this.emit(SeverityNumber.INFO, logRecord)
  }

  public warn (logRecord: LogRecord): void {
    this.emit(SeverityNumber.WARN, logRecord)
  }

  public error (logRecord: LogRecord): void {
    this.emit(SeverityNumber.ERROR, logRecord)
  }

  private emit (severity: SeverityNumber, record: LogRecord): void {
    if (process.env.NODE_ENV === 'test' || this.logProvider == null) {
      return
    }

    this.logProvider.emit({
      severityNumber: severity,
      timestamp: Date.now(),
      body: JSON.stringify(record.body),
      attributes: {
        env: process.env.NODE_ENV,
        host: this.hostname,
        context: record.context,
        ...record.attributes,
        query: JSON.stringify(record.attributes?.query)
      }
    })
  }
}

const openTelemetryLogger = new OpenTelemetryLogger()

export default openTelemetryLogger
