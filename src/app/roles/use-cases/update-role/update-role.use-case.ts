import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { RoleNameAlreadyInUseError } from '../../errors/role-name-already-in-use.error.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { UpdateRoleCommand } from './update-role.command.js'
import { UpdateRoleRepository } from './update-role.repository.js'
import { RoleRenamedEvent } from './role-renamed.event.js'

@Injectable()
export class UpdateRoleUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: UpdateRoleRepository
  ) {}

  async execute (uuid: string, command: UpdateRoleCommand): Promise<void> {
    const role = await this.repository.findRole(uuid)

    if (role === null) {
      throw new RoleNotFoundError(uuid)
    }

    if (await this.repository.isNameAlreadyInUse(command.name, role)) {
      throw new RoleNameAlreadyInUseError(command.name)
    }

    const previousName = role.name
    role.name = command.name
    const event = new RoleRenamedEvent(role, previousName)

    await transaction(this.dataSource, async () => {
      await this.repository.updateName(role)
      await this.eventEmitter.emitOne(event)
    })
  }
}
