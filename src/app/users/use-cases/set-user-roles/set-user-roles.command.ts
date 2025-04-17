import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, IsUUID } from 'class-validator'
import { RoleUuid } from '../../../roles/entities/role.uuid.js'

export class SetUserRolesCommand {
  @ApiProperty({ type: String, format: 'uuid', isArray: true })
  @IsArray()
  @IsString({ each: true })
  @IsUUID('all', { each: true })
  roleUuids: RoleUuid[]
}
