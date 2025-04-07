import { randomUUID } from 'node:crypto'
import * as os from 'node:os'
import { DomainEventType } from './domain-event-type.js'
import { DomainEventSubjectType } from './domain-event-subject-type.enum.js'

export type DomainEventOptions<Content extends object = object> = {
  content: Content
  subjectType?: DomainEventSubjectType
  subjectId?: string
}

export class DomainEvent<Content extends object = object> {
  public readonly id: string
  public readonly createdAt: Date
  public readonly content: Content
  public readonly version: number
  public readonly source: string
  public readonly type: DomainEventType
  public readonly subjectType?: DomainEventSubjectType
  public readonly subjectId?: string

  constructor (options: DomainEventOptions<Content>) {
    this.id = randomUUID()
    this.createdAt = new Date()
    this.content = options.content
    this.source = os.hostname()
    this.subjectId = options.subjectId
    this.subjectType = options.subjectType
  }
}
