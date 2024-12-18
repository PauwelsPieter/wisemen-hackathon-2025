import { BatchSpanProcessor, type Span } from '@opentelemetry/sdk-trace-base'

export class IgnoredSpansProcessor extends BatchSpanProcessor {
  private readonly IGNORED_PG_BOSS_QUERIES = [
    'WITH nextJob as',
    'INSERT INTO pgboss.job',
    'SELECT cron_on, EXTRACT'
  ]

  onEnd (span: Span) {
    if (this.ignorePgBossStatement(span)) {
      return
    }

    super.onEnd(span)
  }

  ignorePgBossStatement (span: Span): boolean {
    const dbStatement = span.attributes['db.statement']?.toString()

    if (dbStatement == null) {
      return false
    }

    // Check if the db.statement starts with any of the ignored prefixes
    return this.IGNORED_PG_BOSS_QUERIES.some(queryPrefix => dbStatement.includes(queryPrefix))
  }
}
