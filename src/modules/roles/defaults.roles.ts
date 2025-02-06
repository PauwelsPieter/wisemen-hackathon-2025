import { Permission } from '../permission/permission.enum.js'

export enum Roles {
  ADMIN = 'admin',
  READONLY = 'readonly'
}

export const rolePermissions: Record<Roles, Permission[]> = {
  [Roles.ADMIN]: [Permission.ALL_PERMISSIONS],
  [Roles.READONLY]: []
}
