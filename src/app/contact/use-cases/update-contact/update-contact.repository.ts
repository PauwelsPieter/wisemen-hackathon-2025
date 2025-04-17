import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { File } from '../../../../modules/files/entities/file.entity.js'
import { FileUuid } from '../../../../modules/files/entities/file.uuid.js'
import { ContactUuid } from '../../entities/contact.uuid.js'
import { UpdateContactCommand } from './update-contact.command.js'

export class UpdateContactRepository {
  constructor (
    @InjectRepository(Contact) private readonly contactRepo: Repository<Contact>,
    @InjectRepository(File) private readonly fileRepo: Repository<File>
  ) {}

  async contactExists (contactUuid: ContactUuid): Promise<boolean> {
    return await this.contactRepo.existsBy({ uuid: contactUuid })
  }

  async fileExists (fileUuid: FileUuid): Promise<boolean> {
    return await this.fileRepo.existsBy({ uuid: fileUuid })
  }

  async updateContact (contactUuid: ContactUuid, command: UpdateContactCommand): Promise<void> {
    await this.contactRepo.update({
      uuid: contactUuid
    }, {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      isActive: command.isActive,
      address: command.address?.parse(),
      fileUuid: command.fileUuid
    })
  }
}
