import { Module } from '@nestjs/common'
import { CreateContactModule } from './use-cases/create-contact/create-contact.module.js'
import { ViewContactsModule } from './use-cases/view-contacts/view-contacts.module.js'
import { ViewContactModule } from './use-cases/view-contact/view-contact.module.js'
import { UpdateContactModule } from './use-cases/update-contact/update-contact.module.js'

@Module({
  imports: [
    CreateContactModule,
    ViewContactsModule,
    ViewContactModule,
    UpdateContactModule
  ]
})
export class ContactModule {}
