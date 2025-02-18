import { ValidationPipe } from '@nestjs/common'
import { convertValidationErrorToJsonApiError } from './convert-validation-errors.js'

export class CustomValidationPipe extends ValidationPipe {
  constructor () {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: errors => convertValidationErrorToJsonApiError(errors)
    })
  }
}
