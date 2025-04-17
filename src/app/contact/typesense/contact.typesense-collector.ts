import { Injectable } from '@nestjs/common'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { AnyOrIgnore, InjectRepository } from '@wisemen/nestjs-typeorm'
import { TypesenseCollector } from '../../../modules/typesense/services/collectors/typesense-collector.factory.js'
import { Contact } from '../entities/contact.entity.js'
import { ContactUuid } from '../entities/contact.uuid.js'
import { TypesenseContact } from './typesense-contact.js'

@Injectable()
export class ContactTypesenseCollector implements TypesenseCollector {
  constructor (
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) {}

  transform (contacts: Contact[]): TypesenseContact[] {
    return contacts.map(contact => new TypesenseContact(contact))
  }

  async fetch (uuids?: ContactUuid[]): Promise<Contact[]> {
    return await this.contactRepository.findBy({ uuid: AnyOrIgnore(uuids) })
  }

  async fetchChanged (since: Date): Promise<Contact[]> {
    return await this.contactRepository.findBy({
      updatedAt: MoreThanOrEqual(since)
    })
  }

  async fetchRemoved (since: Date): Promise<string[]> {
    return await this.contactRepository.findBy({
      deletedAt: MoreThanOrEqual(since)
    }).then(contacts => contacts.map(contact => contact.uuid))
  }
}
