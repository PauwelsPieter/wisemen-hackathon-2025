import { CoordinatesCommandBuilder, CoordinatesCommand } from '@wisemen/coordinates'
import { AddressCommand } from './address-command.js'

export class AddressCommandBuilder {
  private command: AddressCommand

  constructor () {
    this.command = new AddressCommand()
    this.command.country = null
    this.command.city = null
    this.command.postalCode = null
    this.command.streetName = null
    this.command.streetNumber = null
    this.command.unit = null
    this.command.coordinates = new CoordinatesCommandBuilder().build()
  }

  withCountry (country: string | null): this {
    this.command.country = country
    return this
  }

  withCity (city: string | null): this {
    this.command.city = city
    return this
  }

  withZipCode (zipCode: string | null): this {
    this.command.postalCode = zipCode
    return this
  }

  withStreetName (streetName: string | null): this {
    this.command.streetName = streetName
    return this
  }

  withStreetNumber (streetNumber: string | null): this {
    this.command.streetNumber = streetNumber
    return this
  }

  withUnit (unit: string | null): this {
    this.command.unit = unit
    return this
  }

  withCoordinates (coordinates: CoordinatesCommand): this {
    this.command.coordinates = coordinates
    return this
  }

  build (): AddressCommand {
    return this.command
  }
}
