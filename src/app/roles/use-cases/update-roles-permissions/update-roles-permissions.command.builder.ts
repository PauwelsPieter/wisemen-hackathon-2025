import { Permission } from '../../../../modules/permission/permission.enum.js'
import {
  UpdateRolesPermissionsCommand,
  UpdateRolesPermissionsCommandItem
} from './update-roles-permissions.command.js'

export class UpdateRolesPermissionsCommandBuilder {
  private readonly command = new UpdateRolesPermissionsCommand()

  constructor () {
    this.command.roles = []
  }

  addRole (uuid: string, permissions: Permission[]): this {
    const item = new UpdateRolesPermissionsCommandItem()

    item.permissions = permissions
    item.roleUuid = uuid

    this.command.roles.push(item)

    return this
  }

  build (): UpdateRolesPermissionsCommand {
    return this.command
  }
}
