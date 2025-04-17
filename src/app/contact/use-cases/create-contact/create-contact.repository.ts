import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { File } from '../../../../modules/files/entities/file.entity.js'
import { FileUuid } from '../../../../modules/files/entities/file.uuid.js'

export class CreateContactRepository {
  constructor (
    @InjectRepository(Contact) private readonly contactRepo: Repository<Contact>,
    @InjectRepository(File) private readonly fileRepo: Repository<File>
  ) {}

  async fileExists (fileUuid: FileUuid): Promise<boolean> {
    return await this.fileRepo.existsBy({ uuid: fileUuid })
  }

  async insert (contact: Contact): Promise<void> {
    await this.contactRepo.insert(contact)
  }
}
