import { FileUuid } from '../../../../modules/files/entities/file.uuid.js'
import { AddressCommand } from '../../../../utils/address/address-command.js'
import { CreateContactCommand } from './create-contact.command.js'

export class CreateContactCommandBuilder {
  private command: CreateContactCommand

  constructor () {
    this.command = new CreateContactCommand()
    this.command.firstName = 'John'
    this.command.lastName = 'Doe'
    this.command.email = null
    this.command.phone = null
    this.command.address = null
    this.command.fileUuid = null
  }

  withFirstName (firstName: string): this {
    this.command.firstName = firstName
    return this
  }

  withLastName (lastName: string): this {
    this.command.lastName = lastName
    return this
  }

  withEmail (email: string): this {
    this.command.email = email
    return this
  }

  withPhone (phone: string): this {
    this.command.phone = phone
    return this
  }

  withAddress (address: AddressCommand | null): this {
    this.command.address = address
    return this
  }

  withFileUuid (fileUuid: FileUuid | null): this {
    this.command.fileUuid = fileUuid
    return this
  }

  build (): CreateContactCommand {
    return this.command
  }
}
