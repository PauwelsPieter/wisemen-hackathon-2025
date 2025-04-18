import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { File } from '../../../../modules/files/entities/file.entity.js'
import { FileUuid } from '../../../../modules/files/entities/file.uuid.js'
import { ContactUuid } from '../../entities/contact.uuid.js'

export class UpdateContactRepository {
  constructor (
    @InjectRepository(Contact) private readonly contactRepo: Repository<Contact>,
    @InjectRepository(File) private readonly fileRepo: Repository<File>
  ) {}

  async findContact (contactUuid: ContactUuid): Promise<Contact | null> {
    return await this.contactRepo.findOneBy({ uuid: contactUuid })
  }

  async fileExists (fileUuid: FileUuid): Promise<boolean> {
    return await this.fileRepo.existsBy({ uuid: fileUuid })
  }

  async updateContact (contact: Contact): Promise<void> {
    await this.contactRepo.save(contact)
  }
}
