import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { UpdateContactCommand } from './update-contact.command.js'

@Injectable()
export class UpdateContactUseCase {
  constructor (
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (
    uuid: string,
    command: UpdateContactCommand
  ): Promise<void> {
    await this.contactRepository.findOneByOrFail({ uuid })

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
  }
}
