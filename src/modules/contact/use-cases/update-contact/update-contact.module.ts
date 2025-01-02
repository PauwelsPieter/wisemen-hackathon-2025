import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { UpdateContactUseCase } from './update-contact.use-case.js'
import { UpdateContactController } from './update-contact.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
    UpdateContactController
  ],
  providers: [
    UpdateContactUseCase
  ]
})
export class UpdateContactModule { }
