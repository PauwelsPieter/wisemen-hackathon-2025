import assert from 'assert'
import { Transformer } from '@appwise/transformer'
import type { User } from '../../users/entities/user.entity.js'
import type { Permission } from '../../permission/permission.enum.js'

export class UserSearchTransformerType {
  id: string
  uuid: string
  firstName: string
  lastName: string
  email: string
  permissions: Permission[]
}

export class UserSearchTransformer
  extends Transformer<User, UserSearchTransformerType> {
  transform (user: User): UserSearchTransformerType {
    assert(user.userRoles != null)

    const permissions = Array.from(new Set(
      user.userRoles.flatMap((userRole) => {
        assert(userRole.role != null)

        return userRole.role.permissions
      })
    ))

    return {
      id: user.uuid,
      uuid: user.uuid,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      permissions: permissions
    }
  }
}
