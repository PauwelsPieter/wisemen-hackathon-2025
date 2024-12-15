import assert from 'assert'
import type { User } from '../../users/entities/user.entity.js'
import type { Permission } from '../../permission/permission.enum.js'

export class UserSearchTransformer {
  id: string
  uuid: string
  firstName: string
  lastName: string
  email: string
  roleUuids: string[]
  permissions: Permission[]

  constructor (user: User) {
    assert(user.userRoles != null)

    this.id = user.uuid
    this.uuid = user.uuid
    this.firstName = user.firstName ?? ''
    this.lastName = user.lastName ?? ''
    this.email = user.email ?? ''
    this.roleUuids = user.userRoles.map(userRole => userRole.roleUuid)
    this.permissions = Array.from(new Set(
      user.userRoles.flatMap((userRole) => {
        assert(userRole.role != null)

        return userRole.role.permissions
      })
    ))
  }
}
