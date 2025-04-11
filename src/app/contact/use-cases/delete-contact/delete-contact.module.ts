import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { DomainEventEmitterModule } from '../../../../modules/domain-events/domain-event-emitter.module.js'
import { DeleteContactUseCase } from './delete-contact.use-case.js'
import { DeleteContactController } from './delete-contact.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    DomainEventEmitterModule
  ],
  controllers: [
    DeleteContactController
  ],
  providers: [
    DeleteContactUseCase
  ]
})
export class DeleteContactModule { }
