import { CreateRoleCommand } from '../../../use-cases/create-role/create-role.command.js'

export class CreateRoleCommandBuilder {
  private command: CreateRoleCommand

  constructor () {
    this.command = new CreateRoleCommand()
    this.command.name = 'test-role'
  }

  withName (name: string): this {
    this.command.name = name

    return this
  }

  build (): CreateRoleCommand {
    return this.command
  }
}
