import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'

@Injectable()
export class DeleteContactUseCase {
  constructor (
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (
    uuid: string
  ): Promise<void> {
    await this.contactRepository.delete({
      uuid
    })
  }
}
