import { Contact } from '../entities/contact.entity.js'

export class TypesenseContact {
  id: string
  name: string
  email?: string
  phone?: string
  country: string | undefined
  city: string | undefined
  postalCode: string | undefined
  streetName: string | undefined
  streetNumber: string | undefined
  unit: string | undefined
  coordinates: [number, number] | undefined
  isActive: boolean | undefined

  constructor (contact: Contact) {
    this.id = contact.uuid
    this.name = (contact.firstName ?? '') + ' ' + (contact.lastName ?? '')
    this.email = contact.email ?? undefined
    this.phone = contact.phone ?? undefined
    this.country = contact.address?.country ?? undefined
    this.city = contact.address?.city ?? undefined
    this.postalCode = contact.address?.postalCode ?? undefined
    this.streetName = contact.address?.streetName ?? undefined
    this.streetNumber = contact.address?.streetNumber ?? undefined
    this.unit = contact.address?.unit ?? undefined
    const coordinates = contact.address?.coordinates
    this.coordinates = coordinates
      ? [coordinates.latitude, coordinates.longitude]
      : undefined
    this.isActive = contact.isActive ?? undefined
  }
}
