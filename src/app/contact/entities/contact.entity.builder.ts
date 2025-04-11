import { randomUUID } from 'crypto'
import { Address } from '../../../utils/address/address.js'
import { Contact } from './contact.entity.js'

export class ContactEntityBuilder {
  private readonly contact: Contact

  constructor () {
    this.contact = new Contact()
    this.contact.uuid = randomUUID()
    this.contact.createdAt = new Date()
    this.contact.updatedAt = new Date()
    this.contact.firstName = null
    this.contact.lastName = null
    this.contact.email = null
    this.contact.phone = null
    this.contact.address = null
    this.contact.isActive = true
  }

  withUuid (uuid: string): this {
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

  build (): Contact {
    return this.contact
  }
}
