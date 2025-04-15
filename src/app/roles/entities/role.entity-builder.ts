import { randomUUID } from 'node:crypto'
import { Permission } from '../../../modules/permission/permission.enum.js'
import { Role } from './role.entity.js'

export class RoleEntityBuilder {
  private role: Role

  constructor () {
    this.role = new Role()
    this.role.uuid = randomUUID()
    this.role.name = randomUUID()
    this.role.createdAt = new Date()
    this.role.updatedAt = new Date()
    this.role.permissions = []
    this.role.isDefault = false
    this.role.isSystemAdmin = false
  }

  withUuid (uuid: string): this {
    this.role.uuid = uuid
    return this
  }

  withName (name: string): this {
    this.role.name = name
    return this
  }

  withCreatedAt (at: Date): this {
    this.role.createdAt = at
    return this
  }

  withUpdatedAt (at: Date): this {
    this.role.updatedAt = at
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
    return this.role
  }
}
