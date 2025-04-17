import { ApiErrorCode } from '../../../modules/exceptions/api-errors/api-error-code.decorator.js'
import { NotFoundApiError } from '../../../modules/exceptions/api-errors/not-found.api-error.js'
import { ContactUuid } from '../entities/contact.uuid.js'

export class ContactNotFoundError extends NotFoundApiError {
  @ApiErrorCode('contact_not_found')
  code: 'contact_not_found'

  meta: never

  constructor (contactUuid: ContactUuid) {
    super(`Contact with uuid ${contactUuid} not found`)
    this.code = 'contact_not_found'
  }
}
