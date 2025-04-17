import { Role } from '../../../entities/role.entity.js'
import { Permission } from '../../../../../modules/permission/permission.enum.js'
import { generateRoleUuid, RoleUuid } from '../../../entities/role.uuid.js'

export class RoleEntityBuilder {
  private role: Role

  constructor () {
    this.reset()
  }

  reset (): this {
    this.role = new Role()

    this.role.uuid = generateRoleUuid()
    this.role.name = 'test-role'
    this.role.permissions = []
    this.role.isSystemAdmin = false
    this.role.isDefault = false

    return this
  }

  withUuid (uuid: RoleUuid): this {
    this.role.uuid = uuid

    return this
  }

  withName (name: string): this {
    this.role.name = name

    return this
  }

  withPermissions (permissions: Permission[]): this {
    this.role.permissions = permissions

    return this
  }

  withIsDefault (isDefault: boolean): this {
    this.role.isDefault = isDefault

    return this
  }

  withIsSystemAdmin (isSystemAdmin: boolean): this {
    this.role.isSystemAdmin = isSystemAdmin

    return this
  }

  build (): Role {
    const result = this.role

    this.reset()

    return result
  }
}
