import { BatchSpanProcessor, type Span } from '@opentelemetry/sdk-trace-base'

export class IgnoredSpansProcessor extends BatchSpanProcessor {
  private readonly IGNORED_PG_BOSS_QUERIES = new Map([
    ['SELECT round(date_part(\'epoch\', now()) * 1000) as time', true],
    ['SELECT cron_on, EXTRACT', true]
  ])

  onEnd (span: Span) {
    if (this.containsIgnoredPgBossStatement(span)) {
      return
    }

    super.onEnd(span)
  }

  containsIgnoredPgBossStatement (span: Span): boolean {
    const dbStatement = span.attributes['db.statement']?.toString()

    return dbStatement !== undefined
      && (this.IGNORED_PG_BOSS_QUERIES.has(dbStatement) || dbStatement.includes('pgboss'))
  }
}
