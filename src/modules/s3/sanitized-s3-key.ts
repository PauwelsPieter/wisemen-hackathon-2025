import { randomUUID } from 'node:crypto'
import { sanitizeS3Key } from '../../utils/helpers/sanitize-s3-key.helper.js'

export type SanitizedS3Key = string
  & { readonly __brand: unique symbol }
  & { readonly __uuid: 'SanitizedS3Key' }

export function generateSanitizedS3Key () {
  return sanitizeS3Key(randomUUID())
}
