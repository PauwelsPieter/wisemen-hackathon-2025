import { randomUUID } from 'node:crypto'
import { UserRole } from '../../../entities/user-role.entity.js'

export class UserRoleEntityBuilder {
  private entity: UserRole

  constructor () {
    this.reset()
  }

  reset (): this {
    this.entity = new UserRole()

    this.entity.userUuid = randomUUID()
    this.entity.roleUuid = randomUUID()

    return this
  }

  withUserUuid (userUuid: string): this {
    this.entity.userUuid = userUuid

    return this
  }

  withRoleUuid (roleUuid: string): this {
    this.entity.roleUuid = roleUuid

    return this
  }

  build (): UserRole {
    const result = this.entity

    this.reset()

    return result
  }
}
