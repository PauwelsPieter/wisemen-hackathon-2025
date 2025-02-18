import type { ValidationError } from 'class-validator'
import { HttpStatus } from '@nestjs/common'
import { snakeCase } from 'change-case'
import { JsonApiError, JsonApiErrorContent } from '../../exceptions/types/json-api-error.type.js'

function convertValidationError (errors: ValidationError[], path = '$'): JsonApiErrorContent[] {
  const convertedErrors: JsonApiErrorContent[] = []

  for (const error of errors) {
    const isArray = Array.isArray(error.target)

    const jsonpath = path + (isArray ? `[${error.property}]` : `.${error.property}`)

    if (error.children === undefined || error.children.length === 0) {
      if (error.constraints !== undefined) {
        const validationConstraintName = Object.keys(error.constraints)[0]

        convertedErrors.push({
          source: { pointer: jsonpath },
          code: 'validation_error.' + snakeCase(validationConstraintName),
          detail: error.constraints !== undefined ? Object.values(error.constraints)[0] : undefined
        })
      }
    } else {
      convertedErrors.push(...convertValidationError(error.children, jsonpath))
    }
  }

  return convertedErrors
}

export function convertValidationErrorToJsonApiError (errors: ValidationError[]): JsonApiError {
  const errorContents = convertValidationError(errors)

  return new JsonApiError(
    HttpStatus.BAD_REQUEST,
    errorContents
  )
}
