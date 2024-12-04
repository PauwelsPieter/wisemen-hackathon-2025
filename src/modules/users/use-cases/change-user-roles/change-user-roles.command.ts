import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsUUID } from 'class-validator'

export class ChangeUserRoleCommand {
  @ApiProperty({ type: String, format: 'uuid', isArray: true })
  @IsArray()
  @IsUUID()
  roleUuids: string[]
}
