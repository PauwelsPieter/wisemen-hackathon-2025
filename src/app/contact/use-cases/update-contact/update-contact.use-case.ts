import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ContactNotFoundError } from '../../errors/contact.not-found.error.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { UpdateContactCommand } from './update-contact.command.js'
import { ContactUpdatedEvent } from './contact-updated.event.js'

@Injectable()
export class UpdateContactUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (
    uuid: string,
    command: UpdateContactCommand
  ): Promise<void> {
    const exists = await this.contactRepository.existsBy({ uuid })

    if (!exists) {
      throw new ContactNotFoundError(uuid)
    }

    const event = new ContactUpdatedEvent(uuid)

    await transaction(this.dataSource, async () => {
      await this.contactRepository.update({
        uuid
      }, {
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        phone: command.phone,
        isActive: command.isActive,
        address: command.address?.parse()
      })
      await this.eventEmitter.emit([event])
    })
  }
}
