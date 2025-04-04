import { randomUUID } from 'node:crypto'
import { API_EVENT_SOURCE } from './constants.js'
import { EventType } from './event-type.js'
import { EventSubjectType } from './event-subject-type.enum.js'

export type WiseEventOptions<Content extends object = object> = {
  topic: string
  content: Content
  version: number
  type: EventType
  subjectType?: EventSubjectType
  subjectId?: string
}

export class WiseEvent<Content extends object = object> {
  public readonly id: string
  public readonly topic: string
  public readonly createdAt: Date
  public readonly content: Content
  public readonly version: number
  public readonly source: string
  public readonly type: EventType
  public readonly subjectType?: EventSubjectType
  public readonly subjectId?: string

  constructor (options: WiseEventOptions<Content>) {
    this.id = randomUUID()
    this.createdAt = new Date()
    this.topic = options.topic
    this.content = options.content
    this.version = options.version
    this.source = API_EVENT_SOURCE
    this.type = options.type
    this.subjectId = options.subjectId
    this.subjectType = options.subjectType
  }
}
