import { ApiProperty } from '@nestjs/swagger'
import { OneOfMetaApiProperty, OneOfResponse, OneOfTypeApiProperty } from '@wisemen/one-of'
import { DomainEventLog } from '../domain-event-log.entity.js'
import { DomainEventType } from '../../domain-events/domain-event-type.js'
import { tcr } from '../../localization/helpers/translate.helper.js'

@OneOfResponse(DomainEventLog)
export class DomainEventLogResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  uuid: string

  @ApiProperty({ type: 'string' })
  topic: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: string

  @ApiProperty({ type: 'integer', minimum: 0 })
  version: number

  @ApiProperty({ type: 'string' })
  source: string

  @ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  userUuid: string | null

  @ApiProperty({ type: 'string' })
  message: string

  @OneOfTypeApiProperty()
  type: DomainEventType

  @OneOfMetaApiProperty()
  content: unknown

  constructor (log: DomainEventLog) {
    this.uuid = log.uuid
    this.topic = log.topic
    this.createdAt = log.createdAt.toISOString()
    this.version = log.version
    this.source = log.source
    this.userUuid = log.userUuid
    this.type = log.type
    this.content = log.content
    this.message = tcr(`event-log.${log.type}.v${log.version}`)
  }
}
