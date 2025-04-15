import { Injectable } from '@nestjs/common'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DataSource } from 'typeorm'
import { ContactNotFoundError } from '../../errors/contact.not-found.error.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { UpdateContactCommand } from './update-contact.command.js'
import { ContactUpdatedEvent } from './contact-updated.event.js'
import { UpdateContactRepository } from './update-contact.repository.js'

@Injectable()
export class UpdateContactUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: UpdateContactRepository
  ) {}

  public async execute (
    uuid: string,
    command: UpdateContactCommand
  ): Promise<void> {
    if (!await this.repository.contactExists(uuid)) {
      throw new ContactNotFoundError(uuid)
    }

    if (command.fileUuid != null && !await this.repository.fileExists(command.fileUuid)) {
      throw new ContactNotFoundError(command.fileUuid)
    }

    const event = new ContactUpdatedEvent(uuid)

    await transaction(this.dataSource, async () => {
      await this.repository.updateContact(uuid, command)
      await this.eventEmitter.emit([event])
    })
  }
}
