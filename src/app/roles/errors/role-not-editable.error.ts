import { ApiProperty } from '@nestjs/swagger'
import { ApiErrorCode } from '../../../modules/exceptions/api-errors/api-error-code.decorator.js'
import { ApiErrorMeta } from '../../../modules/exceptions/api-errors/api-error-meta.decorator.js'
import { BadRequestApiError } from '../../../modules/exceptions/api-errors/bad-request.api-error.js'
import { Role } from '../entities/role.entity.js'

export class RoleNotEditableErrorMeta {
  @ApiProperty({
    format: 'uuid',
    required: true,
    description: 'the role uuid which cannot be edited'
  })
  readonly uuid: string

  @ApiProperty({
    required: true,
    description: 'the role name which cannot be edited',
    example: 'default'
  })
  readonly name: string

  constructor (role: Role) {
    this.uuid = role.uuid
    this.name = role.name
  }
}

export class RoleNotEditableError extends BadRequestApiError {
  @ApiErrorCode('role_not_editable')
  readonly code = 'role_not_editable'

  @ApiErrorMeta()
  readonly meta: RoleNotEditableErrorMeta

  constructor (role: Role) {
    super(`This role is not editable`)
    this.meta = new RoleNotEditableErrorMeta(role)
  }
}
