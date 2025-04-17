import { ApiProperty } from '@nestjs/swagger'
import { OneOfMetaApiProperty, OneOfResponse, OneOfTypeApiProperty } from '@wisemen/one-of'
import { DomainEventLog } from '../domain-event-log.entity.js'
import { DomainEventType } from '../../domain-events/domain-event-type.js'
import { tcr } from '../../localization/helpers/translate.helper.js'
import { DomainEventSubjectType } from '../../domain-events/domain-event-subject-type.enum.js'
import { DomainEventSubjectTypeApiProperty } from '../../domain-events/domain-event-subject-type.api-property.js'
import { UserUuid } from '../../../app/users/entities/user.uuid.js'

@OneOfResponse(DomainEventLog)
export class DomainEventLogResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  uuid: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: string

  @ApiProperty({ type: 'integer', minimum: 0 })
  version: number

  @ApiProperty({ type: 'string' })
  source: string

  @ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  userUuid: UserUuid | null

  @ApiProperty({ type: 'string' })
  message: string

  @OneOfTypeApiProperty()
  type: DomainEventType

  @DomainEventSubjectTypeApiProperty({ nullable: true })
  subjectType: DomainEventSubjectType | null

  @ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  subjectId: string | null

  @OneOfMetaApiProperty()
  content: unknown

  constructor (log: DomainEventLog) {
    this.uuid = log.uuid
    this.createdAt = log.createdAt.toISOString()
    this.version = log.version
    this.source = log.source
    this.userUuid = log.userUuid
    this.type = log.type
    this.content = log.content
    this.subjectType = log.subjectType
    this.subjectId = log.subjectId
    this.message = tcr(`event-log.${log.type}.v${log.version}`)
  }
}
