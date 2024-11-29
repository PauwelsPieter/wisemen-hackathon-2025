import * as Sentry from '@sentry/nestjs'

console.log(process.env.SENTRY_DSN)

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: Number(process.env.SENTRY_ERROR_SAMPLE_RATE ?? '1')
})
