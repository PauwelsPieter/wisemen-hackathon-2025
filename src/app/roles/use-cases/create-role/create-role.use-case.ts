import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { RoleNameAlreadyInUseError } from '../../errors/role-name-already-in-use.error.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { RoleEntityBuilder } from '../../entities/role.entity-builder.js'
import { CreateRoleCommand } from './create-role.command.js'
import { CreateRoleRepository } from './create-role.repository.js'
import { RoleCreatedEvent } from './role-created.event.js'
import { CreateRoleResponse } from './create-role.response.js'

@Injectable()
export class CreateRoleUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: CreateRoleRepository
  ) {}

  async execute (command: CreateRoleCommand): Promise<CreateRoleResponse> {
    if (await this.repository.isNameAlreadyInUse(command.name)) {
      throw new RoleNameAlreadyInUseError(command.name)
    }

    const role = new RoleEntityBuilder()
      .withName(command.name)
      .build()

    const event = new RoleCreatedEvent(role)

    await transaction(this.dataSource, async () => {
      await this.repository.insert(role)
      await this.eventEmitter.emitOne(event)
    })

    return new CreateRoleResponse(role.uuid)
  }
}
