import { Injectable } from '@nestjs/common'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DataSource } from 'typeorm'
import { RoleNotEditableError } from '../../errors/role-not-editable.error.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { RoleUuid } from '../../entities/role.uuid.js'
import { DeleteRoleRepository } from './delete-role.repository.js'
import { RoleDeletedEvent } from './role-deleted.event.js'

@Injectable()
export class DeleteRoleUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: DeleteRoleRepository
  ) {}

  async execute (uuid: RoleUuid): Promise<void> {
    const role = await this.repository.findRole(uuid)

    if (role === null) {
      throw new RoleNotFoundError(uuid)
    }

    if (role.isSystemAdmin) {
      throw new RoleNotEditableError(role)
    }

    const event = new RoleDeletedEvent(role)

    await transaction(this.dataSource, async () => {
      await this.repository.delete(role)
      await this.eventEmitter.emitOne(event)
    })
  }
}
