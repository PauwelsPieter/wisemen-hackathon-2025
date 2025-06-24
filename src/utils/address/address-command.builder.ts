import { CoordinatesCommand } from '@wisemen/coordinates'
import { AddressCommand } from './address-command.js'

export class AddressCommandBuilder {
  private command: AddressCommand

  constructor () {
    this.command = new AddressCommand()
  }

  withCountry (country: string): this {
    this.command.country = country
    return this
  }

  withCity (city: string): this {
    this.command.city = city
    return this
  }

  withPostalCode (postalCode: string): this {
    this.command.postalCode = postalCode
    return this
  }

  withStreetName (streetName: string): this {
    this.command.streetName = streetName
    return this
  }

  withStreetNumber (streetNumber: string): this {
    this.command.streetNumber = streetNumber
    return this
  }

  withUnit (unit: string): this {
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
