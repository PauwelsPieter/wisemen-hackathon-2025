import type { Permission } from '../../../../modules/permission/permission.enum.js'

export interface UpdateRoleTransformedType {
  uuid: string
  permissions: Permission[]
}
