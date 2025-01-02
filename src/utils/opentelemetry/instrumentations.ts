import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk'
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis-4'

export function registerInstruments (): void {
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
