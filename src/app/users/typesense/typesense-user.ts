import assert from 'assert'
import type { User } from '../entities/user.entity.js'
import { Permission } from '../../../modules/permission/permission.enum.js'

export class TypesenseUser {
  id: string
  uuid: string
  firstName: string
  lastName: string
  email: string
  roleUuids: string[]
  permissions: Permission[]

  constructor (user: User) {
    assert(user.userRoles != null)

    const userRoles = user.userRoles
    const permissions = userRoles.flatMap((userRole) => {
      assert(userRole.role != null)

      return userRole.role.permissions
    })

    return {
      id: user.uuid,
      uuid: user.uuid,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      roleUuids: userRoles.map(userRole => userRole.roleUuid),
      permissions: Array.from(new Set(permissions))
    }
  }
}
