import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { DomainEventEmitterModule } from '../../../../modules/domain-events/domain-event-emitter.module.js'
import { File } from '../../../../modules/files/entities/file.entity.js'
import { CreateContactUseCase } from './create-contact.use-case.js'
import { CreateContactController } from './create-contact.controller.js'
import { CreateContactRepository } from './create-contact.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, File]),
    DomainEventEmitterModule
  ],
  controllers: [
    CreateContactController
  ],
  providers: [
    CreateContactUseCase,
    CreateContactRepository
  ]
})
export class CreateContactModule { }
