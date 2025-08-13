import { randomUUID } from 'node:crypto'

export type S3Key = string & { readonly __brand: unique symbol }

export function generateS3Key (): S3Key {
  return randomUUID() as S3Key
}
