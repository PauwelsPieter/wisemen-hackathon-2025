import { PermissionObject } from '../../../../permission/transformers/permission.transformer.js'
import { UpdateRolesBulkCommand, UpdateRolesBulkRoleCommand } from '../../../use-cases/update-roles-bulk/update-roles-bulk.command.js'

export class UpdateRolesBulkCommandBuilder {
  private command: UpdateRolesBulkCommand

  constructor () {
    this.command = new UpdateRolesBulkCommand()
    this.command.roles = []
  }

  withUpdateRolesBulkRoleCommand (role: UpdateRolesBulkRoleCommand): this {
    this.command.roles.push(role)

    return this
  }

  build (): UpdateRolesBulkCommand {
    return this.command
  }
}

export class UpdateRolesBulkRoleCommandBuilder {
  private command: UpdateRolesBulkRoleCommand

  constructor () {
    this.command = new UpdateRolesBulkRoleCommand()
  }

  withRoleUuid (roleUuid: string): this {
    this.command.uuid = roleUuid

    return this
  }

  withName (name: string): this {
    this.command.name = name

    return this
  }

  withPermissions (permissions: PermissionObject[]): this {
    this.command.permissions = permissions

    return this
  }

  build (): UpdateRolesBulkRoleCommand {
    return this.command
  }
}

export class PermissionObjectBuilder {
  private permissionObject: PermissionObject

  constructor () {
    this.permissionObject = new PermissionObject()
    this.permissionObject.actions = []
  }

  withId (id: string): this {
    this.permissionObject.id = id

    return this
  }

  withActions (actions: string[]): this {
    this.permissionObject.actions = actions

    return this
  }

  build (): PermissionObject {
    return this.permissionObject
  }
}
