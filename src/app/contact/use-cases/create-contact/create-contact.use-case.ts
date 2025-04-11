import { DataSource, Repository } from 'typeorm'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { Injectable } from '@nestjs/common'
import { Contact } from '../../entities/contact.entity.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { ContactEntityBuilder } from '../../entities/contact.entity.builder.js'
import { CreateContactCommand } from './create-contact.command.js'
import { CreateContactResponse } from './create-contact.response.js'
import { ContactCreatedEvent } from './contact-created.event.js'

@Injectable()
export class CreateContactUseCase {
  constructor (
    private readonly datasource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (
    command: CreateContactCommand
  ): Promise<CreateContactResponse> {
    const contact = new ContactEntityBuilder()
      .withFirstName(command.firstName)
      .withLastName(command.lastName)
      .withEmail(command.email)
      .withPhone(command.phone)
      .withAddress(command.address?.parse() ?? null)
      .build()

    const event = new ContactCreatedEvent(contact)

    await transaction(this.datasource, async () => {
      await this.contactRepository.insert(contact)
      await this.eventEmitter.emit([event])
    })

    return new CreateContactResponse(contact)
  }
}
