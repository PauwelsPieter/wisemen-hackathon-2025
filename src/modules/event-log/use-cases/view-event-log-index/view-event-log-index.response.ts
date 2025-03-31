import { ApiProperty } from '@nestjs/swagger'
import { OneOfApiExtraModels, OneOfApiProperty } from '@wisemen/one-of'
import { PaginatedKeysetResponse, PaginatedKeysetResponseMeta } from '@wisemen/pagination'
import { EventLogResponse } from '../../response/event-log.response.js'
import { EventLog } from '../../event-log.entity.js'
import { ViewEventLogIndexQueryKey } from './view-event-log-index.query.key.js'

class ViewEventLogIndexResponseMeta implements PaginatedKeysetResponseMeta {
  @ApiProperty({ type: ViewEventLogIndexQueryKey, nullable: true })
  next: ViewEventLogIndexQueryKey | null

  constructor (logs: EventLog[]) {
    this.next = ViewEventLogIndexQueryKey.nextKey(logs)
  }
}

@OneOfApiExtraModels(EventLog)
export class ViewEventLogIndexResponse implements PaginatedKeysetResponse {
  @OneOfApiProperty(EventLog, { type: EventLogResponse, isArray: true })
  items: EventLogResponse[]

  @ApiProperty({ type: ViewEventLogIndexResponseMeta })
  meta: ViewEventLogIndexResponseMeta

  constructor (eventLogs: EventLog[]) {
    this.items = eventLogs.map(log => new EventLogResponse(log))
    this.meta = new ViewEventLogIndexResponseMeta(eventLogs)
  }
}
