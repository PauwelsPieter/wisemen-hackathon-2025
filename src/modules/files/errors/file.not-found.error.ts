import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { NotFoundApiError } from '../../exceptions/api-errors/not-found.api-error.js'

export class FileNotFoundError extends NotFoundApiError {
  @ApiErrorCode('file_not_found')
  code: 'file_not_found'

  meta: never

  constructor (fileUuid: string) {
    super(`File with uuid ${fileUuid} not found`)
    this.code = 'file_not_found'
  }
}
