import { Injectable, Logger } from '@nestjs/common'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DataSource } from 'typeorm'
import { wiseDate } from '@wisemen/wise-date'
import { ContactNotFoundError } from '../../errors/contact.not-found.error.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { ContactUuid } from '../../entities/contact.uuid.js'
import { FileNotFoundError } from '../../../../modules/files/errors/file.not-found.error.js'
import { Contact } from '../../entities/contact.entity.js'
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
    uuid: ContactUuid,
    command: UpdateContactCommand
  ): Promise<void> {
    const contact = await this.repository.findContact(uuid)
    if (contact === null) {
      throw new ContactNotFoundError(uuid)
    }

    if (command.fileUuid != null && !await this.repository.fileExists(command.fileUuid)) {
      throw new FileNotFoundError(command.fileUuid)
    }

    this.updateContact(contact, command)
    const event = new ContactUpdatedEvent(uuid)

    try {
      await transaction(this.dataSource, async () => {
        await this.repository.updateContact(contact)
        await this.eventEmitter.emit([event])
      })
    } catch (error) {
      Logger.log(error)
    }
  }

  private updateContact (contact: Contact, command: UpdateContactCommand): void {
    contact.address = command.address?.parse() ?? null
    contact.balance = command.balance?.parse() ?? null
    contact.discount = command.balance?.parse() ?? null
    contact.firstName = command.firstName
    contact.lastName = command.lastName
    contact.email = command.email
    contact.phone = command.phone
    contact.isActive = command.isActive
    contact.fileUuid = command.fileUuid
    contact.birthDate = wiseDate(command.birthDate)
  }
}
