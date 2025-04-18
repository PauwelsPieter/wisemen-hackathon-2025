import { Monetary } from '@wisemen/monetary'
import { Address } from '../../../utils/address/address.js'
import { Contact } from './contact.entity.js'
import { ContactUuid, generateContactUuid } from './contact.uuid.js'

export class ContactEntityBuilder {
  private readonly contact: Contact

  constructor () {
    this.contact = new Contact()
    this.contact.uuid = generateContactUuid()
    this.contact.createdAt = new Date()
    this.contact.updatedAt = new Date()
    this.contact.firstName = null
    this.contact.lastName = null
    this.contact.email = null
    this.contact.phone = null
    this.contact.address = null
    this.contact.isActive = true
    this.contact.fileUuid = null
    this.contact.discount = null
    this.contact.balance = null
  }

  withUuid (uuid: ContactUuid): this {
    this.contact.uuid = uuid
    return this
  }

  withFirstName (firstName: string | null): this {
    this.contact.firstName = firstName
    return this
  }

  withLastName (lastName: string | null): this {
    this.contact.lastName = lastName
    return this
  }

  withEmail (email: string | null): this {
    this.contact.email = email
    return this
  }

  withPhone (phone: string | null): this {
    this.contact.phone = phone
    return this
  }

  withAddress (address: Address | null): this {
    this.contact.address = address
    return this
  }

  withIsActive (isActive: boolean): this {
    this.contact.isActive = isActive
    return this
  }

  withFileUuid (fileUuid: string | null): this {
    this.contact.fileUuid = fileUuid
    return this
  }

  withBalance (amount: Monetary | null): this {
    this.contact.balance = amount
    return this
  }

  withDiscount (amount: Monetary | null): this {
    this.contact.discount = amount
    return this
  }

  build (): Contact {
    return this.contact
  }
}
