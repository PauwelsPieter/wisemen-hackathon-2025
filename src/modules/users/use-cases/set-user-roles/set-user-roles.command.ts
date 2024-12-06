import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsUUID } from 'class-validator'

export class SetUserRolesCommand {
  @ApiProperty({ type: String, format: 'uuid', isArray: true })
  @IsArray()
  @IsUUID()
  roleUuids: string[]
}
