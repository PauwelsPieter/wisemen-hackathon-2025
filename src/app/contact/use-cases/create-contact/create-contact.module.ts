import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { DomainEventEmitterModule } from '../../../../modules/domain-events/domain-event-emitter.module.js'
import { CreateContactUseCase } from './create-contact.use-case.js'
import { CreateContactController } from './create-contact.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    DomainEventEmitterModule
  ],
  controllers: [
    CreateContactController
  ],
  providers: [
    CreateContactUseCase
  ]
})
export class CreateContactModule { }
