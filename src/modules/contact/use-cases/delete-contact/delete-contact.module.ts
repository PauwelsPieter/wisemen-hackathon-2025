import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { DeleteContactUseCase } from './delete-contact.use-case.js'
import { DeleteContactController } from './delete-contact.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
    DeleteContactController
  ],
  providers: [
    DeleteContactUseCase
  ]
})
export class DeleteContactModule { }
