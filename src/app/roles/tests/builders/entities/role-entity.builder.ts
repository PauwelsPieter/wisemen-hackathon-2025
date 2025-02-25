import { randomUUID } from 'node:crypto'
import { Role } from '../../../entities/role.entity.js'
import { Permission } from '../../../../../modules/permission/permission.enum.js'

export class RoleEntityBuilder {
  private roleEntity: Role

  constructor () {
    this.reset()
  }

  reset (): this {
    this.roleEntity = new Role()

    this.roleEntity.uuid = randomUUID()
    this.roleEntity.name = 'test-role'
    this.roleEntity.permissions = []
    this.roleEntity.isSystemAdmin = false
    this.roleEntity.isDefault = false

    return this
  }

  withUuid (uuid: string): this {
    this.roleEntity.uuid = uuid

    return this
  }

  withName (name: string): this {
    this.roleEntity.name = name

    return this
  }

  withPermissions (permissions: Permission[]): this {
    this.roleEntity.permissions = permissions

    return this
  }

  withIsDefault (isDefault: boolean): this {
    this.roleEntity.isDefault = isDefault

    return this
  }

  withIsSystemAdmin (isSystemAdmin: boolean): this {
    this.roleEntity.isSystemAdmin = isSystemAdmin

    return this
  }

  build (): Role {
    const result = this.roleEntity

    this.reset()

    return result
  }
}
