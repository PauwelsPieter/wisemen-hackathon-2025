import { Repository } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Injectable } from '@nestjs/common'
import { Contact } from '../../entities/contact.entity.js'
import { CreateContactCommand } from './create-contact.command.js'
import { CreateContactResponse } from './create-contact.response.js'

@Injectable()
export class CreateContactUseCase {
  constructor (
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (
    command: CreateContactCommand
  ): Promise<CreateContactResponse> {
    const contact = this.contactRepository.create({
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      address: command.address?.parse() ?? null
    })

    await this.contactRepository.insert(contact)

    return new CreateContactResponse(contact)
  }
}
