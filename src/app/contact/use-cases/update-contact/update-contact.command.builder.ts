import { FileUuid } from '../../../../modules/files/entities/file.uuid.js'
import { AddressCommand } from '../../../../utils/address/address-command.js'
import { UpdateContactCommand } from './update-contact.command.js'

export class UpdateContactCommandBuilder {
  private command: UpdateContactCommand

  constructor () {
    this.command = new UpdateContactCommand()
    this.command.firstName = null
    this.command.lastName = null
    this.command.email = null
    this.command.phone = null
    this.command.isActive = true
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

  withIsActive (isActive: boolean): this {
    this.command.isActive = isActive
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

  build (): UpdateContactCommand {
    return this.command
  }
}
