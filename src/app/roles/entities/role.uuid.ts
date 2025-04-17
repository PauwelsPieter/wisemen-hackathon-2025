import { randomUUID } from 'node:crypto'
import { Uuid } from '../../../utils/types/uuid.js'

export type RoleUuid = Uuid<'Role'>

export function generateRoleUuid (): RoleUuid {
  return randomUUID() as RoleUuid
}
