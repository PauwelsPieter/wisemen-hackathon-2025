import { randomUUID } from 'node:crypto'
import { Uuid } from '../../../utils/types/uuid.js'

export type FileUuid = Uuid<'File'>

export function generateFileUuid (): FileUuid {
  return randomUUID() as FileUuid
}
