import { randomUUID } from 'node:crypto'
import { Uuid } from '../../../utils/types/uuid.js'

export type UserUuid = Uuid<'User'>

export function generateUserUuid (): UserUuid {
  return randomUUID() as UserUuid
}
