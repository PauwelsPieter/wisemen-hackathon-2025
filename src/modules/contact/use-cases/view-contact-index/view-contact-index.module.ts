import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ViewContactIndexUseCase } from './view-contact-index.use-case.js'
import { ViewContactIndexController } from './view-contact-index.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
    ViewContactIndexController
  ],
  providers: [
    ViewContactIndexUseCase
  ]
})
export class ViewContactIndexModule { }
