import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  uuid: string

  constructor (roleUuid: string) {
    this.uuid = roleUuid
  }
}
