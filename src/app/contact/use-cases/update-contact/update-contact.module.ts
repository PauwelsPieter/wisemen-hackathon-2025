import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { File } from '../../../../modules/files/entities/file.entity.js'
import { UpdateContactUseCase } from './update-contact.use-case.js'
import { UpdateContactController } from './update-contact.controller.js'
import { UpdateContactRepository } from './update-contact.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, File])
  ],
  controllers: [
    UpdateContactController
  ],
  providers: [
    UpdateContactUseCase,
    UpdateContactRepository
  ]
})
export class UpdateContactModule { }
