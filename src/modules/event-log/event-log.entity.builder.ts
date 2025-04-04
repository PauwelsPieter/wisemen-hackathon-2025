import { randomUUID } from 'node:crypto'
import { EventType } from '../events/event-type.js'
import { EventLog } from './event-log.entity.js'

export class EventLogEntityBuilder {
  private readonly log: EventLog

  constructor () {
    this.log = new EventLog()
    this.log.uuid = randomUUID()
    this.log.createdAt = new Date()
    this.log.userUuid = null
    this.log.type = EventType.USER_CREATED
    this.log.source = 'tests'
    this.log.content = {}
    this.log.topic = ''
    this.log.version = 0
  }

  withUuid (uuid: string): this {
    this.log.uuid = uuid

    return this
  }

  withTopic (topic: string): this {
    this.log.topic = topic

    return this
  }

  withCreatedAt (date: Date): this {
    this.log.createdAt = date

    return this
  }

  withVersion (version: number): this {
    this.log.version = version

    return this
  }

  withSource (source: string): this {
    this.log.source = source

    return this
  }

  withType (type: EventType): this {
    this.log.type = type

    return this
  }

  withContent (content: object): this {
    this.log.content = content

    return this
  }

  withUserUuid (uuid: string | null): this {
    this.log.userUuid = uuid

    return this
  }

  build (): EventLog {
    return this.log
  }
}
