import {
  LoggerProvider,
  BatchLogRecordProcessor
} from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { SeverityNumber, type Logger } from '@opentelemetry/api-logs'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getOtelServiceName } from '@wisemen/opentelemetry'
import { getOTLPExporterHeaders } from '../signoz-auth.js'

export enum LogContext {
  INFO = 'info'
}

interface LogRecord {
  context: LogContext
  body: object
  attributes?: Record<string, unknown>
}

@Injectable()
export class OpenTelemetryLoggerService implements OnModuleInit {
  private loggerProvider: LoggerProvider
  private logProvider: Logger | null
  private readonly hostname: string

  constructor (private readonly configService: ConfigService) {
    this.hostname = getOtelServiceName()
  }

  onModuleInit () {
    const logEndpoint = this.configService.get<string>('SIGNOZ_LOG_ENDPOINT')

    if (logEndpoint == null || logEndpoint === '') {
      return
    }

    const headers = getOTLPExporterHeaders()

    const logExporter = new OTLPLogExporter({
      url: logEndpoint,
      headers,
      concurrencyLimit: 1
    })

    this.loggerProvider = new LoggerProvider({
      processors: [new BatchLogRecordProcessor(logExporter)]
    })

    this.logProvider = this.loggerProvider.getLogger('default')
  }

  info (logRecord: LogRecord): void {
    this.emit(SeverityNumber.INFO, logRecord)
  }

  warn (logRecord: LogRecord): void {
    this.emit(SeverityNumber.WARN, logRecord)
  }

  error (logRecord: LogRecord): void {
    this.emit(SeverityNumber.ERROR, logRecord)
  }

  private emit (severity: SeverityNumber, record: LogRecord): void {
    if (process.env.NODE_ENV === 'test' || this.logProvider == null) {
      return
    }

    this.logProvider.emit({
      severityNumber: severity,
      severityText: SeverityNumber[severity],
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
