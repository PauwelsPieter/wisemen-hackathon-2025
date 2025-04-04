import { ApiProperty } from '@nestjs/swagger'
import { OneOfMetaApiProperty, OneOfResponse, OneOfTypeApiProperty } from '@wisemen/one-of'
import { EventLog } from '../event-log.entity.js'
import { EventType } from '../../events/event-type.js'
import { tcr } from '../../localization/helpers/translate.helper.js'

@OneOfResponse(EventLog)
export class EventLogResponse {
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
  type: EventType

  @OneOfMetaApiProperty()
  content: unknown

  constructor (log: EventLog) {
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
