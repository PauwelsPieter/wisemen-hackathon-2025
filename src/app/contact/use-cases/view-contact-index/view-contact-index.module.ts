import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { TypesenseModule } from '../../../../modules/typesense/modules/typesense.module.js'
import { ViewContactIndexUseCase } from './view-contact-index.use-case.js'
import { ViewContactIndexController } from './view-contact-index.controller.js'

@Module({
  imports: [
    TypesenseModule,
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
