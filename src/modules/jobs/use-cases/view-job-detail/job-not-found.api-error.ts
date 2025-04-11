import { ApiErrorCode } from '../../../exceptions/api-errors/api-error-code.decorator.js'
import { NotFoundApiError } from '../../../exceptions/api-errors/not-found.api-error.js'

export class JobNotFoundError extends NotFoundApiError {
  @ApiErrorCode('job_not_found')
  code = 'job_not_found'

  meta: unknown

  constructor () {
    super('Job not found')
  }
}
