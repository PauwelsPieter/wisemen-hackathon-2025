import { S3Key } from './s3-key.js'

export const FORBIDDEN_S3_CHARACTERS = '&$@=;:+ ?\\{}%`[]"<>~#|'

/**
 * https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
 */
export function sanitizeS3Key (key: string, replaceWith: string = ''): S3Key {
  let sanitizedKey = key

  for (const forbiddenChar of FORBIDDEN_S3_CHARACTERS) {
    sanitizedKey = sanitizedKey.replaceAll(forbiddenChar, replaceWith)
  }

  // eslint-disable-next-line no-control-regex
  const nonPrintableASCII = /[\x00-\x1F\x7F\x80-\x9F]/g
  sanitizedKey = sanitizedKey.replace(nonPrintableASCII, replaceWith)

  sanitizedKey = sanitizedKey.replaceAll(/\/{2,}/g, '/')

  if (sanitizedKey.startsWith('/')) {
    sanitizedKey = sanitizedKey.slice(1)
  }

  const encoder = new TextEncoder()
  const utf8Length = encoder.encode(sanitizedKey).length
  if (utf8Length > 1024) {
    throw new Error(`The s3 key must be <= 1,024 bytes`)
  }

  return sanitizedKey as S3Key
}
