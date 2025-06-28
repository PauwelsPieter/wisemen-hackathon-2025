import { UserRole } from '../../../entities/user-role.entity.js'
import { RoleUuid } from '../../../entities/role.uuid.js'
import { UserUuid } from '../../../../users/entities/user.uuid.js'
import { generateUuid } from '../../../../../utils/types/uuid.js'

export class UserRoleEntityBuilder {
  private entity: UserRole

  constructor () {
    this.reset()
  }

  reset (): this {
    this.entity = new UserRole()

    this.entity.userUuid = generateUuid()
    this.entity.roleUuid = generateUuid()

    return this
  }

  withUserUuid (userUuid: UserUuid): this {
    this.entity.userUuid = userUuid

    return this
  }

  withRoleUuid (uuid: RoleUuid): this {
    this.entity.roleUuid = uuid

    return this
  }

  build (): UserRole {
    const result = this.entity

    this.reset()

    return result
  }
}
