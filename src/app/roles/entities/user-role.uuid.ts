import { randomUUID } from 'node:crypto'
import { Uuid } from '../../../utils/types/uuid.js'

export type UserRoleUuid = Uuid<'UserRole'>

export function generateUserRoleUuid (): UserRoleUuid {
  return randomUUID() as UserRoleUuid
}
