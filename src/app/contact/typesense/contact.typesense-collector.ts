import { MoreThanOrEqual, Repository } from 'typeorm'
import { AnyOrIgnore, InjectRepository } from '@wisemen/nestjs-typeorm'
import { Contact } from '../entities/contact.entity.js'
import { ContactUuid } from '../entities/contact.uuid.js'
import { TypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.js'
import { RegisterTypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.decorator.js'
import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { TypesenseContact } from './typesense-contact.js'

@RegisterTypesenseCollector(TypesenseCollectionName.CONTACT)
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
    return await this.contactRepository.find({
      select: { uuid: true },
      where: { deletedAt: MoreThanOrEqual(since) },
      withDeleted: true
    }).then(contacts => contacts.map(contact => contact.uuid))
  }
}
