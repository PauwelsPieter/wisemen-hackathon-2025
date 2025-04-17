import { randomUUID } from 'node:crypto'
import { DomainEventType } from '../domain-events/domain-event-type.js'
import { DomainEventSubjectType } from '../domain-events/domain-event-subject-type.enum.js'
import { UserUuid } from '../../app/users/entities/user.uuid.js'
import { DomainEventLog } from './domain-event-log.entity.js'

export class DomainEventLogEntityBuilder {
  private readonly log: DomainEventLog

  constructor () {
    this.log = new DomainEventLog()
    this.log.uuid = randomUUID()
    this.log.createdAt = new Date()
    this.log.userUuid = null
    this.log.type = DomainEventType.USER_CREATED
    this.log.source = 'tests'
    this.log.content = {}
    this.log.version = 0
  }

  withUuid (uuid: string): this {
    this.log.uuid = uuid
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

  withType (type: DomainEventType): this {
    this.log.type = type
    return this
  }

  withContent (content: object): this {
    this.log.content = content
    return this
  }

  withSubjectType (type: DomainEventSubjectType | null): this {
    this.log.subjectType = type
    return this
  }

  withSubjectId (id: string | null): this {
    this.log.subjectId = id
    return this
  }

  withUserUuid (uuid: UserUuid | null): this {
    this.log.userUuid = uuid
    return this
  }

  build (): DomainEventLog {
    return this.log
  }
}
