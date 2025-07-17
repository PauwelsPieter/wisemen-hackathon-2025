import { Coordinates } from '@wisemen/coordinates'
import { Address } from './address.js'

export class AddressBuilder {
  private readonly address: Address

  constructor () {
    this.address = new Address()
  }

  withPlaceName (name?: string | null): this {
    this.address.placeName = name ?? undefined
    return this
  }

  withPlaceId (id?: string | null): this {
    this.address.placeId = id ?? undefined
    return this
  }

  withCountry (country?: string | null): this {
    this.address.country = country ?? undefined
    return this
  }

  withCity (city?: string | null): this {
    this.address.city = city ?? undefined
    return this
  }

  withPostalCode (zipCode?: string | null): this {
    this.address.postalCode = zipCode ?? undefined
    return this
  }

  withStreetName (streetName?: string | null): this {
    this.address.streetName = streetName ?? undefined
    return this
  }

  withStreetNumber (streetNumber?: string | null): this {
    this.address.streetNumber = streetNumber ?? undefined
    return this
  }

  withUnit (unit?: string | null): this {
    this.address.unit = unit ?? undefined
    return this
  }

  withCoordinates (coordinates?: Coordinates | null): this {
    this.address.coordinates = coordinates ?? undefined
    return this
  }

  build (): Address {
    return this.address
  }
}
