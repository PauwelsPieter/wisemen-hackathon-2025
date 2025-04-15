import { ApiProperty } from '@nestjs/swagger'

export class NotificationCreatedResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly uuid: string

  constructor (uuid: string) {
    this.uuid = uuid
  }
}
