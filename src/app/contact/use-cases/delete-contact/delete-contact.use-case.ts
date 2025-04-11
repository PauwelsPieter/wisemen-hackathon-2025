import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { ContactNotFoundError } from '../../errors/contact.not-found.error.js'
import { ContactDeletedEvent } from './contact-deleted.event.js'

@Injectable()
export class DeleteContactUseCase {
  constructor (
    private readonly datasource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (
    uuid: string
  ): Promise<void> {
    const exists = await this.contactRepository.existsBy({ uuid })
    if (!exists) {
      throw new ContactNotFoundError(uuid)
    }

    const event = new ContactDeletedEvent(uuid)
    await transaction(this.datasource, async () => {
      await this.contactRepository.softDelete({ uuid })
      await this.eventEmitter.emit([event])
    })
  }
}
