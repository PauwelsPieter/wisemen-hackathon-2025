import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ViewContactsResponse } from './view-contacts.response.js'

@Injectable()
export class ViewContactsUseCase {
  constructor (
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (): Promise<ViewContactsResponse> {
    const [contacts, count] = await this.contactRepository.findAndCount()

    return new ViewContactsResponse(contacts, count, 10, 0)
  }
}
