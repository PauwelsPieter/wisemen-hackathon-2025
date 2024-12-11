import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator'
import { PermissionObject } from '../../../permission/transformers/permission.transformer.js'

export class UpdateRolesBulkRoleCommand {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUUID()
  uuid: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string

  @ApiProperty({ type: PermissionObject, isArray: true })
  @IsArray()
  permissions: PermissionObject[]
}

export class UpdateRolesBulkCommand {
  @ApiProperty({ type: [UpdateRolesBulkRoleCommand] })
  @ValidateNested({ each: true })
  @Type(() => UpdateRolesBulkRoleCommand)
  @IsArray()
  @IsNotEmpty()
  roles: UpdateRolesBulkRoleCommand[]
}
