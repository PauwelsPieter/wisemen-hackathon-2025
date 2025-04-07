import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsUUID } from 'class-validator'
import { DomainEventLog } from '../../domain-event-log.entity.js'

export class ViewDomainEventLogIndexQueryKey {
  @ApiProperty({ format: 'datetime' })
  @IsISO8601({ strict: true })
  createdAt: string

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  uuid: string

  static nextKey (logs: DomainEventLog[]): ViewDomainEventLogIndexQueryKey | null {
    if (logs.length == 0) {
      return null
    }

    const lastItem = logs.at(-1) as DomainEventLog

    return this.from(lastItem)
  }

  static from (log: DomainEventLog): ViewDomainEventLogIndexQueryKey {
    const key = new ViewDomainEventLogIndexQueryKey()

    key.createdAt = log.createdAt.toISOString()
    key.uuid = log.uuid

    return key
  }
}
