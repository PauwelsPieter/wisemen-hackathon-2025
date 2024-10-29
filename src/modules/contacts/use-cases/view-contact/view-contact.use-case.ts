import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ViewContactResponse } from './view-contact.response.js'

@Injectable()
export class ViewContactUseCase {
  constructor (
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (uuid: string): Promise<ViewContactResponse> {
    const contact = await this.contactRepository.findOneOrFail({
      where: {
        uuid
      }
    })

    return new ViewContactResponse(contact)
  }
}
