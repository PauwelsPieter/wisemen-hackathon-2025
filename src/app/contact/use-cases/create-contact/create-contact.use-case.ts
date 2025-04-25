import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { Injectable } from '@nestjs/common'
import { wiseDate } from '@wisemen/wise-date'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { ContactEntityBuilder } from '../../entities/contact.entity.builder.js'
import { FileNotFoundError } from '../../../../modules/files/errors/file.not-found.error.js'
import { CreateContactCommand } from './create-contact.command.js'
import { CreateContactResponse } from './create-contact.response.js'
import { ContactCreatedEvent } from './contact-created.event.js'
import { CreateContactRepository } from './create-contact.repository.js'

@Injectable()
export class CreateContactUseCase {
  constructor (
    private readonly datasource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private repository: CreateContactRepository
  ) {}

  public async execute (
    command: CreateContactCommand
  ): Promise<CreateContactResponse> {
    if (command.fileUuid != null && !await this.repository.fileExists(command.fileUuid)) {
      throw new FileNotFoundError(command.fileUuid)
    }

    const contact = new ContactEntityBuilder()
      .withFirstName(command.firstName)
      .withLastName(command.lastName)
      .withEmail(command.email)
      .withPhone(command.phone)
      .withAddress(command.address?.parse() ?? null)
      .withFileUuid(command.fileUuid)
      .withBalance(command.balance?.parse() ?? null)
      .withDiscount(command.discount?.parse() ?? null)
      .withBirthDate(wiseDate(command.birthDate))
      .build()

    const event = new ContactCreatedEvent(contact)

    await transaction(this.datasource, async () => {
      await this.repository.insert(contact)
      await this.eventEmitter.emit([event])
    })

    return new CreateContactResponse(contact)
  }
}
