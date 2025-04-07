import { ApiProperty } from '@nestjs/swagger'
import { OneOfApiExtraModels, OneOfApiProperty } from '@wisemen/one-of'
import { PaginatedKeysetResponse, PaginatedKeysetResponseMeta } from '@wisemen/pagination'
import { DomainEventLogResponse } from '../../response/domain-event-log.response.js'
import { DomainEventLog } from '../../domain-event-log.entity.js'
import { ViewDomainEventLogIndexQueryKey } from './view-domain-event-log-index.query.key.js'

class ViewDomainEventLogIndexResponseMeta implements PaginatedKeysetResponseMeta {
  @ApiProperty({ type: ViewDomainEventLogIndexQueryKey, nullable: true })
  next: ViewDomainEventLogIndexQueryKey | null

  constructor (logs: DomainEventLog[]) {
    this.next = ViewDomainEventLogIndexQueryKey.nextKey(logs)
  }
}

@OneOfApiExtraModels(DomainEventLog)
export class ViewDomainEventLogIndexResponse implements PaginatedKeysetResponse {
  @OneOfApiProperty(DomainEventLog, { type: DomainEventLogResponse, isArray: true })
  items: DomainEventLogResponse[]

  @ApiProperty({ type: ViewDomainEventLogIndexResponseMeta })
  meta: ViewDomainEventLogIndexResponseMeta

  constructor (eventLogs: DomainEventLog[]) {
    this.items = eventLogs.map(log => new DomainEventLogResponse(log))
    this.meta = new ViewDomainEventLogIndexResponseMeta(eventLogs)
  }
}
