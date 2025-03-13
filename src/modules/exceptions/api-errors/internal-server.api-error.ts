import { captureException } from '@sentry/nestjs'
import { EnvType } from '../../config/env.enum.js'
import { JsonApiErrorContent } from '../types/json-api-error.type.js'

export class InternalServerErrorContent extends JsonApiErrorContent {
  code = 'internal_server_error'
  message = 'The server was unable to complete your request. Please try again later.'

  constructor (error: Error) {
    super()

    if (process.env.NODE_ENV !== EnvType.PRODUCTION) {
      this.detail = error.message
    }

    this.id = captureException(error)
  }
}
