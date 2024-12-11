import type { Permission } from '../../../permission/permission.enum.js'

export interface UpdateRoleTransformedType {
  uuid: string
  permissions: Permission[]
}
