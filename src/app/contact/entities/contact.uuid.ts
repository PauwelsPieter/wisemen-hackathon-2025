import { randomUUID } from 'node:crypto'
import { Uuid } from '../../../utils/types/uuid.js'

export type ContactUuid = Uuid<'Contact'>

export function generateContactUuid (): ContactUuid {
  return randomUUID() as ContactUuid
}
