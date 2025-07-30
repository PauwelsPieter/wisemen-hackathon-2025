import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ApiErrorCode } from '../../../modules/exceptions/api-errors/api-error-code.decorator.js'
import { ApiErrorStatus } from '../../../modules/exceptions/api-errors/api-error-status.decorator.js'
import { ApiError } from '../../../modules/exceptions/api-errors/api-error.js'
import { ApiErrorMeta } from '../api-errors/api-error-meta.decorator.js'

export class UnauthorizedErrorMeta {
  @ApiProperty({ type: String })
  readonly name: string

  @ApiProperty({ type: String })
  readonly message: string

  @ApiProperty({ type: String, nullable: true })
  readonly stack?: string

  constructor (error: Error) {
    this.name = error.name
    this.message = error.message
    this.stack = error.stack
  }
}

export class UnauthorizedError extends ApiError {
  @ApiErrorCode('unauthorized')
  readonly code = 'unauthorized'

  @ApiErrorMeta()
  meta: UnauthorizedErrorMeta

  @ApiErrorStatus(HttpStatus.UNAUTHORIZED)
  declare status: '401'

  constructor (detail?: string, error?: Error) {
    super(detail ?? 'Unauthorized')
    this.status = '401'

    if (error != null) {
      this.meta = new UnauthorizedErrorMeta(error)
    }
  }
}
