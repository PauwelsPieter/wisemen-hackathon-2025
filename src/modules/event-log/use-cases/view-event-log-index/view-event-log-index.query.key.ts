import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsUUID } from 'class-validator'
import { EventLog } from '../../event-log.entity.js'

export class ViewEventLogIndexQueryKey {
  @ApiProperty({ format: 'datetime' })
  @IsISO8601({ strict: true })
  createdAt: string

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  uuid: string

  static nextKey (logs: EventLog[]): ViewEventLogIndexQueryKey | null {
    if (logs.length == 0) {
      return null
    }

    const lastItem = logs.at(-1) as EventLog

    return this.from(lastItem)
  }

  static from (log: EventLog): ViewEventLogIndexQueryKey {
    const key = new ViewEventLogIndexQueryKey()

    key.createdAt = log.createdAt.toISOString()
    key.uuid = log.uuid

    return key
  }
}
