import { ClientRequest, IncomingMessage } from 'http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk'
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis-4'
import { Span } from '@opentelemetry/sdk-trace-base'

export function registerInstruments (): void {
  if (process.env.NODE_ENV === 'test') return

  registerInstrumentations({
    instrumentations: [
      new PgInstrumentation({
        enhancedDatabaseReporting: true
      }),
      new HttpInstrumentation({
        requestHook: (span: Span, request: ClientRequest | IncomingMessage): void => {
          if (request instanceof ClientRequest) {
            const route = request.path.substring(0, request.path.indexOf('?'))

            span.updateName(`${request.method} ${route}`)
          } else {
            const route = request.url?.substring(0, request.url.indexOf('?'))

            span.updateName(`${request.method} ${route}`)
          }
        }
      }),
      new ExpressInstrumentation({
        ignoreLayersType: [ExpressLayerType.MIDDLEWARE, ExpressLayerType.REQUEST_HANDLER]
      }),
      new NestInstrumentation({}),
      new AwsInstrumentation({
        suppressInternalInstrumentation: true
      }),
      new RedisInstrumentation({
        responseHook: (span: Span, cmdName: string, cmdArgs: (string | Buffer)[]) => {
          const spanName = `[Redis] ${cmdName} ${cmdArgs[0].toString()}`

          span.updateName(spanName)
        },
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
